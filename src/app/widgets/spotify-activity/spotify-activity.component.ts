import { Component, OnInit } from '@angular/core';
import { SpotifyApiService, SpotifyPlayHistory } from '../../services/spotify-api.service';

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
  recentTracks: SpotifyPlayHistory[] = [];

  /** Error flag */
  error = false;

  constructor(private spotifyApi: SpotifyApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = false;

    this.spotifyApi.getRecentlyPlayed(5).subscribe({
      next: (data) => {
        this.recentTracks = data.items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load Spotify activity', err);
        this.error = true;
        this.loading = false;
      }
    });
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
