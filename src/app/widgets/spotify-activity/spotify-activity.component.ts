import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify-activity',
  templateUrl: './spotify-activity.component.html',
  styleUrls: ['./spotify-activity.component.css']
})
export class SpotifyActivityComponent implements OnInit {

  /** Spotify user id (used for profile-link in the template) */
  spotifyUserId = 'littlepazienza';   // TODO: read from config/env

  /** Indicates widget is currently fetching data */
  loading = true;

  /** Recently played tracks to display */
  tracks: SpotifyTrack[] = [];

  ngOnInit(): void {
    /*
     * ------------------------------------------------------------------
     * NOTE: This is mocked data so the widget renders while we wait for
     *       real Spotify API credentials.  Replace the timeout with an
     *       HttpClient GET to `https://api.spotify.com/v1/me/player/...`
     *       once OAuth flow is configured.
     * ------------------------------------------------------------------ */
    setTimeout(() => {
      this.tracks = [
        {
          name: 'Feels Like Summer',
          artist: 'Childish Gambino',
          album: 'Summer Pack',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273d01d3f3f94a639a6a39aea66'
        },
        {
          name: 'Lose Yourself to Dance',
          artist: 'Daft Punk',
          album: 'Random Access Memories',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273acd7953c8e9851ee48e23688'
        },
        {
          name: 'Under the Sun',
          artist: 'DIIV',
          album: 'Oshin',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273cbb97e61ff88c19cd85307fa'
        },
        {
          name: 'Saturn',
          artist: 'Sleeping at Last',
          album: 'Atlas: Year One',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273a7dd567c90e1c13c4c327582'
        },
        {
          name: 'everything i wanted',
          artist: 'Billie Eilish',
          album: 'everything i wanted',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273db4b547b8bc27d8739ae0c24'
        }
      ];

      this.loading = false;
    }, 900);
  }

}

/**
 * Minimal structure representing a Spotify track shown in the widget.
 * Extend with additional fields (e.g., preview_url) once the real API
 * integration is in place.
 */
export interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
}
