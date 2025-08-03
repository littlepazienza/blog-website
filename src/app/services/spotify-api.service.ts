import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';

/**
 * Spotify API base URL and endpoints
 * In a production app, these would be in environment.ts files
 */
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT = `${SPOTIFY_API_URL}/me/player/recently-played`;
const USER_PROFILE_ENDPOINT = `${SPOTIFY_API_URL}/me`;

// These would be in environment.ts in a real app
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const SPOTIFY_REDIRECT_URI = 'http://localhost:4200/callback';

/**
 * Spotify API response interfaces
 */
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  uri: string;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  popularity: number;
}

export interface SpotifyPlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    uri: string;
    external_urls: {
      spotify: string;
    };
  } | null;
}

export interface SpotifyRecentlyPlayed {
  items: SpotifyPlayHistory[];
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  images: SpotifyImage[];
  country: string;
  product: string;
  uri: string;
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private accessToken: string | null = null;
  private tokenExpiration: Date | null = null;
  private refreshToken: string | null = null;

  constructor(private http: HttpClient) {
    // Load tokens from localStorage if available
    this.loadTokensFromStorage();
  }

  /**
   * Get the user's recently played tracks
   * @param limit Number of tracks to retrieve (default: 10, max: 50)
   * @param before Unix timestamp in milliseconds to get tracks before
   * @returns Observable of recently played tracks
   */
  getRecentlyPlayed(limit: number = 10, before?: number): Observable<SpotifyRecentlyPlayed> {
    // If we're not authenticated or using a mock, return mock data
    if (!this.isAuthenticated()) {
      return this.getMockRecentlyPlayed(limit);
    }

    let params = new HttpParams().set('limit', limit.toString());
    if (before) {
      params = params.set('before', before.toString());
    }

    return this.http.get<SpotifyRecentlyPlayed>(RECENTLY_PLAYED_ENDPOINT, {
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(
      retry(1),
      catchError(this.handleError),
      tap(data => console.log(`Fetched ${data.items.length} recently played tracks`))
    );
  }

  /**
   * Get the current user's Spotify profile
   * @returns Observable of user profile
   */
  getUserProfile(): Observable<SpotifyUserProfile> {
    // If we're not authenticated or using a mock, return mock data
    if (!this.isAuthenticated()) {
      return this.getMockUserProfile();
    }

    return this.http.get<SpotifyUserProfile>(USER_PROFILE_ENDPOINT, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError),
      tap(profile => console.log(`Fetched profile for ${profile.display_name}`))
    );
  }

  /**
   * Initiate the Spotify OAuth flow
   * This redirects the user to Spotify's authorization page
   */
  initiateAuth(): void {
    const scopes = [
      'user-read-recently-played',
      'user-read-email',
      'user-read-private'
    ];

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI);
    authUrl.searchParams.append('scope', scopes.join(' '));
    
    // Redirect to Spotify auth page
    window.location.href = authUrl.toString();
  }

  /**
   * Handle the callback from Spotify OAuth
   * @param code Authorization code from Spotify
   * @returns Observable of auth response
   */
  handleAuthCallback(code: string): Observable<SpotifyAuthResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', SPOTIFY_REDIRECT_URI);
    body.set('client_id', SPOTIFY_CLIENT_ID);
    body.set('client_secret', SPOTIFY_CLIENT_SECRET);

    return this.http.post<SpotifyAuthResponse>(SPOTIFY_AUTH_URL, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Refresh the access token using the refresh token
   * @returns Observable of auth response
   */
  refreshAccessToken(): Observable<SpotifyAuthResponse> {
    if (!this.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', this.refreshToken);
    body.set('client_id', SPOTIFY_CLIENT_ID);
    body.set('client_secret', SPOTIFY_CLIENT_SECRET);

    return this.http.post<SpotifyAuthResponse>(SPOTIFY_AUTH_URL, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Check if the user is authenticated with Spotify
   * @returns True if authenticated and token is valid
   */
  isAuthenticated(): boolean {
    return !!this.accessToken && 
           !!this.tokenExpiration && 
           this.tokenExpiration > new Date();
  }

  /**
   * Clear all authentication data
   */
  logout(): void {
    this.accessToken = null;
    this.tokenExpiration = null;
    this.refreshToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
    localStorage.removeItem('spotify_refresh_token');
  }

  /**
   * Get mock recently played tracks for development
   * @param limit Number of tracks to return
   * @returns Observable of mock recently played data
   */
  private getMockRecentlyPlayed(limit: number = 10): Observable<SpotifyRecentlyPlayed> {
    // Create mock data that matches the Spotify API response structure
    const mockTracks: SpotifyPlayHistory[] = [
      {
        track: {
          id: '1',
          name: 'Levitating',
          duration_ms: 203500,
          artists: [{
            id: '1',
            name: 'Dua Lipa',
            type: 'artist',
            uri: 'spotify:artist:6M2wZ9GZgrQXHCFfjv46we',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we'
            }
          }],
          album: {
            id: '1',
            name: 'Future Nostalgia',
            album_type: 'album',
            artists: [{
              id: '1',
              name: 'Dua Lipa',
              type: 'artist',
              uri: 'spotify:artist:6M2wZ9GZgrQXHCFfjv46we',
              external_urls: {
                spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we'
              }
            }],
            images: [{
              url: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
              height: 640,
              width: 640
            }],
            release_date: '2020-03-27',
            uri: 'spotify:album:7fJJK56U9fHixgO0HQkhtI',
            external_urls: {
              spotify: 'https://open.spotify.com/album/7fJJK56U9fHixgO0HQkhtI'
            }
          },
          uri: 'spotify:track:39LLxExYz6ewLAcYrzQQyP',
          external_urls: {
            spotify: 'https://open.spotify.com/track/39LLxExYz6ewLAcYrzQQyP'
          },
          preview_url: null,
          popularity: 90
        },
        played_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        context: {
          type: 'album',
          uri: 'spotify:album:7fJJK56U9fHixgO0HQkhtI',
          external_urls: {
            spotify: 'https://open.spotify.com/album/7fJJK56U9fHixgO0HQkhtI'
          }
        }
      },
      {
        track: {
          id: '2',
          name: 'Blinding Lights',
          duration_ms: 200040,
          artists: [{
            id: '2',
            name: 'The Weeknd',
            type: 'artist',
            uri: 'spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ'
            }
          }],
          album: {
            id: '2',
            name: 'After Hours',
            album_type: 'album',
            artists: [{
              id: '2',
              name: 'The Weeknd',
              type: 'artist',
              uri: 'spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ',
              external_urls: {
                spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ'
              }
            }],
            images: [{
              url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
              height: 640,
              width: 640
            }],
            release_date: '2020-03-20',
            uri: 'spotify:album:4yP0hdKOZPNshxUOjY0cZj',
            external_urls: {
              spotify: 'https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj'
            }
          },
          uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
          external_urls: {
            spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b'
          },
          preview_url: null,
          popularity: 95
        },
        played_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        context: {
          type: 'playlist',
          uri: 'spotify:playlist:37i9dQZF1DX7ZUug1ANKRP',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX7ZUug1ANKRP'
          }
        }
      },
      {
        track: {
          id: '3',
          name: 'Rust In Peace...Polaris',
          duration_ms: 310520,
          artists: [{
            id: '3',
            name: 'Megadeth',
            type: 'artist',
            uri: 'spotify:artist:1Yox196W7bzVNZI7RBaPnf',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/1Yox196W7bzVNZI7RBaPnf'
            }
          }],
          album: {
            id: '3',
            name: 'Rust In Peace',
            album_type: 'album',
            artists: [{
              id: '3',
              name: 'Megadeth',
              type: 'artist',
              uri: 'spotify:artist:1Yox196W7bzVNZI7RBaPnf',
              external_urls: {
                spotify: 'https://open.spotify.com/artist/1Yox196W7bzVNZI7RBaPnf'
              }
            }],
            images: [{
              url: 'https://i.scdn.co/image/ab67616d0000b273c49d47d6d04c3ffa6a0f0823',
              height: 640,
              width: 640
            }],
            release_date: '1990-09-24',
            uri: 'spotify:album:1HxbwlpyML3aWjgbEYSp8j',
            external_urls: {
              spotify: 'https://open.spotify.com/album/1HxbwlpyML3aWjgbEYSp8j'
            }
          },
          uri: 'spotify:track:1EIGwYpNkMM3HoJgdQvyLs',
          external_urls: {
            spotify: 'https://open.spotify.com/track/1EIGwYpNkMM3HoJgdQvyLs'
          },
          preview_url: null,
          popularity: 62
        },
        played_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        context: {
          type: 'album',
          uri: 'spotify:album:1HxbwlpyML3aWjgbEYSp8j',
          external_urls: {
            spotify: 'https://open.spotify.com/album/1HxbwlpyML3aWjgbEYSp8j'
          }
        }
      },
      {
        track: {
          id: '4',
          name: 'Lofi Study Beat',
          duration_ms: 185000,
          artists: [{
            id: '4',
            name: 'Chillhop Music',
            type: 'artist',
            uri: 'spotify:artist:0CFuMybe6s7NRgJKfMCn0O',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0CFuMybe6s7NRgJKfMCn0O'
            }
          }],
          album: {
            id: '4',
            name: 'Coding Session',
            album_type: 'album',
            artists: [{
              id: '4',
              name: 'Chillhop Music',
              type: 'artist',
              uri: 'spotify:artist:0CFuMybe6s7NRgJKfMCn0O',
              external_urls: {
                spotify: 'https://open.spotify.com/artist/0CFuMybe6s7NRgJKfMCn0O'
              }
            }],
            images: [{
              url: 'https://i.scdn.co/image/ab67616d0000b273cbf8fec5ee5a0c74a47c1426',
              height: 640,
              width: 640
            }],
            release_date: '2023-01-15',
            uri: 'spotify:album:2R0QqGXsNS2LmUZ8KMb6aC',
            external_urls: {
              spotify: 'https://open.spotify.com/album/2R0QqGXsNS2LmUZ8KMb6aC'
            }
          },
          uri: 'spotify:track:5odlY52u43F5BjByhxg7wg',
          external_urls: {
            spotify: 'https://open.spotify.com/track/5odlY52u43F5BjByhxg7wg'
          },
          preview_url: null,
          popularity: 75
        },
        played_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        context: {
          type: 'playlist',
          uri: 'spotify:playlist:37i9dQZF1DX8NTLI2TtZa6',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6'
          }
        }
      },
      {
        track: {
          id: '5',
          name: 'Chlorine',
          duration_ms: 290520,
          artists: [{
            id: '5',
            name: 'Twenty One Pilots',
            type: 'artist',
            uri: 'spotify:artist:3YQKmKGau1PzlVlkL1iodx',
            external_urls: {
              spotify: 'https://open.spotify.com/artist/3YQKmKGau1PzlVlkL1iodx'
            }
          }],
          album: {
            id: '5',
            name: 'Trench',
            album_type: 'album',
            artists: [{
              id: '5',
              name: 'Twenty One Pilots',
              type: 'artist',
              uri: 'spotify:artist:3YQKmKGau1PzlVlkL1iodx',
              external_urls: {
                spotify: 'https://open.spotify.com/artist/3YQKmKGau1PzlVlkL1iodx'
              }
            }],
            images: [{
              url: 'https://i.scdn.co/image/ab67616d0000b273d91f93d2ceae428f7b5d4aac',
              height: 640,
              width: 640
            }],
            release_date: '2018-10-05',
            uri: 'spotify:album:621cXqrj8QSKJRqVylCJEN',
            external_urls: {
              spotify: 'https://open.spotify.com/album/621cXqrj8QSKJRqVylCJEN'
            }
          },
          uri: 'spotify:track:2SiXAy7TuUkycRVbbWDEpo',
          external_urls: {
            spotify: 'https://open.spotify.com/track/2SiXAy7TuUkycRVbbWDEpo'
          },
          preview_url: null,
          popularity: 82
        },
        played_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        context: {
          type: 'album',
          uri: 'spotify:album:621cXqrj8QSKJRqVylCJEN',
          external_urls: {
            spotify: 'https://open.spotify.com/album/621cXqrj8QSKJRqVylCJEN'
          }
        }
      }
    ];

    // Return only the requested number of tracks
    const limitedTracks = mockTracks.slice(0, limit);

    const mockResponse: SpotifyRecentlyPlayed = {
      items: limitedTracks,
      next: null,
      cursors: {
        after: '1635560846000',
        before: '1635474446000'
      },
      limit: limit,
      href: RECENTLY_PLAYED_ENDPOINT
    };

    return of(mockResponse).pipe(
      tap(() => console.log('Returning mock Spotify recently played data'))
    );
  }

  /**
   * Get mock user profile for development
   * @returns Observable of mock user profile
   */
  private getMockUserProfile(): Observable<SpotifyUserProfile> {
    const mockProfile: SpotifyUserProfile = {
      id: 'littlepazienza',
      display_name: 'Ben Pazienza',
      email: 'littlepazienza@gmail.com',
      external_urls: {
        spotify: 'https://open.spotify.com/user/littlepazienza'
      },
      followers: {
        href: null,
        total: 42
      },
      images: [{
        url: 'https://i.scdn.co/image/ab6775700000ee85a0c9f6c92b0b41e6d3c8951c',
        height: 640,
        width: 640
      }],
      country: 'US',
      product: 'premium',
      uri: 'spotify:user:littlepazienza'
    };

    return of(mockProfile).pipe(
      tap(() => console.log('Returning mock Spotify user profile'))
    );
  }

  /**
   * Process and store the authentication response
   * @param response Auth response from Spotify
   */
  private handleAuthResponse(response: SpotifyAuthResponse): void {
    this.accessToken = response.access_token;
    
    // Calculate token expiration
    const expiresInMs = response.expires_in * 1000;
    this.tokenExpiration = new Date(Date.now() + expiresInMs);
    
    // Store refresh token if provided
    if (response.refresh_token) {
      this.refreshToken = response.refresh_token;
    }
    
    // Save to localStorage for persistence
    this.saveTokensToStorage();
  }

  /**
   * Save authentication tokens to localStorage
   */
  private saveTokensToStorage(): void {
    if (this.accessToken) {
      localStorage.setItem('spotify_access_token', this.accessToken);
    }
    
    if (this.tokenExpiration) {
      localStorage.setItem('spotify_token_expiration', this.tokenExpiration.toISOString());
    }
    
    if (this.refreshToken) {
      localStorage.setItem('spotify_refresh_token', this.refreshToken);
    }
  }

  /**
   * Load authentication tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    const token = localStorage.getItem('spotify_access_token');
    const expiration = localStorage.getItem('spotify_token_expiration');
    const refresh = localStorage.getItem('spotify_refresh_token');
    
    if (token) {
      this.accessToken = token;
    }
    
    if (expiration) {
      this.tokenExpiration = new Date(expiration);
    }
    
    if (refresh) {
      this.refreshToken = refresh;
    }
  }

  /**
   * Get HTTP headers with authorization token
   * @returns HttpHeaders object with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Error handler for HTTP requests
   * @param error The HTTP error response
   * @returns An observable error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Token expired, try to refresh
      console.error('Spotify token expired, please refresh');
      return throwError(() => new Error('Spotify authentication expired. Please log in again.'));
    }
    
    if (error.status === 429) {
      // Rate limited
      const retryAfter = error.headers.get('Retry-After');
      console.error(`Rate limited by Spotify API. Retry after ${retryAfter} seconds`);
      return throwError(() => new Error(`Spotify API rate limit exceeded. Please try again in ${retryAfter} seconds.`));
    }
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client error:', error.error.message);
    } else {
      // Backend returned unsuccessful response code
      console.error(
        `Spotify API returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    
    return throwError(() => new Error('Something went wrong with the Spotify API request. Please try again later.'));
  }
}
