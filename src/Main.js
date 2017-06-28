import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import CreateButton from './CreateButton';
import GridColumn from './GridColumn';
import GridColumnHeader from './GridColumnHeader';
import Loading from './Loading';
import MenuButton from './MenuButton';
import SelectButton from './SelectButton';
import IntroScreen from './IntroScreen';
import ExportPlaylist from './ExportPlaylist';
import throttle from './throttle';
import states from './states';
import selectionMutator from './selectionMutator';
import dataFetcher from './data/dataFetcher';

const WINDOW_SMALL_SIZE_THRESHOLD = 680;
const GRID_CELL_SIZE_LARGE = 181;
const GRID_CELL_SIZE_SMALL = 121;
const MAX_TRACKS_PER_PLAYLIST_ADDITION = 100;
const SCROLL_BUFFER = GRID_CELL_SIZE_LARGE * 2;

class Main extends Component {
  constructor() {
    super();
    this.state = {
      spotify: null,
      state: states.LOADING,
      artists: [],
      trackCount: 0,
      selection: {},
      initialSelection: {},
      mostRecentSelection: null,
      selectionCount: 0,
      selectionDurationMs: 0,
      percentComplete: 0,
      scrollX: window.scrollX,
      containerWidth: window.innerWidth,
      gridCellSize: GRID_CELL_SIZE_LARGE,
      scrollBuffer: SCROLL_BUFFER,
      scrollContext: document.getElementById('root')
    };
  }

  componentWillMount() {
    if (!this.props.accessToken) {
      throw new Error('The Main component should not be rendered without a valid accessToken prop');
    }
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(this.props.accessToken);
    this.setState(
      {
        spotify: spotifyApi,
        state: states.LOADING
      },
      () => {
        this._fetchData();
      }
    );

    this._updateSizesPerWindowSize();

    // Kind of nasty to listen to global scroll events here.
    // YOLO.
    this._updateSizesPerWindowSize = throttle(this._updateSizesPerWindowSize, 250);
    this._handleScroll = throttle(this._handleScroll, 250);
    this.state.scrollContext.addEventListener('scroll', this._handleScroll, false);
    window.addEventListener('resize', this._updateSizesPerWindowSize, false);
  }

  componentWillUnmount() {
    document.getElementById('root').removeEventListener('scroll', this._handleScroll, false);
    window.removeEventListener('resize', this._updateSizesPerWindowSize, false);
  }

  render() {
    const artists = this.state.artists;
    let content;
    let width = 'inherit';
    if (artists.length > 0) {
      width = this.state.gridCellSize * artists.length + 'px';
      content = (
        <div className="grid-outer" style={{ width: '100%' }}>
          <div className="grid-header">
            {artists.map(this._renderColumnHeader)}
          </div>
          <div className="grid-body">
            {artists.map(this._renderColumn)}
          </div>
          <div>
            <IntroScreen />
            <div className="footer">
              <MenuButton />
              <SelectButton
                trackCount={this.state.trackCount}
                onSelectAll={this._handleSelectAll}
                onSelectNone={this._handleSelectNone}
                onSelectRandom={this._handleSelectRandom}
                onSelectInitial={this._handleSelectInitial}
                onSelectRecommended={this._handleSelectRecommended}
              />
              <div className="duration">{this._formatDuration(this.state.selectionDurationMs)}</div>
              <CreateButton
                selectionCount={this.state.selectionCount}
                state={this.state.state}
                onCreate={this._createPlaylist}
                onEdit={this._editPlaylistName}
              />

            </div>

            {this.state.state === states.EDITING_PLAYLIST_NAME ||
              this.state.state === states.CREATING_PLAYLIST ||
              this.state.state === states.PLAYLIST_CREATED
              ? <ExportPlaylist
                  onExport={this._createPlaylist}
                  onClose={this._handleModalClose}
                  state={this.state.state}
                />
              : null}
          </div>
        </div>
      );
    } else {
      content = <Loading percentComplete={this.state.percentComplete} />;
    }
    return (
      <div className="main" style={{ width }}>
        {content}
      </div>
    );
  }

  _renderColumnHeader = artist => {
    return <GridColumnHeader artist={artist} key={artist.id} onArtistToggle={this._toggleArtist} />;
  };

  _renderColumn = (artist, idx) => {
    const leftColPos = idx * this.state.gridCellSize;
    const imagesVisible = leftColPos > this.state.scrollX - this.state.scrollBuffer &&
      leftColPos < this.state.scrollX + this.state.containerWidth + this.state.scrollBuffer;
    return (
      <GridColumn
        artist={artist}
        key={artist.id}
        imagesVisible={imagesVisible}
        selection={this.state.selection}
        mostRecentSelection={this.state.mostRecentSelection}
        forceRerender={this.state.percentComplete < 100}
        onArtistToggle={this._toggleArtist}
        onTrackToggle={this._toggleTrack}
      />
    );
  };

  _updateSizesPerWindowSize = () => {
    const desiredCellSize = window.innerWidth > WINDOW_SMALL_SIZE_THRESHOLD
      ? GRID_CELL_SIZE_LARGE
      : GRID_CELL_SIZE_SMALL;
    if (this.state.gridCellSize !== desiredCellSize) {
      this.setState({
        gridCellSize: desiredCellSize,
        scrollBuffer: desiredCellSize * 2
      });
    }
    this._handleScroll();
  };

  _editPlaylistName = () => {
    this.setState({ state: states.EDITING_PLAYLIST_NAME });
  };

  _createPlaylist = (name: string) => {
    const spotify = this.state.spotify;

    this.setState({ state: states.CREATING_PLAYLIST });

    spotify
      .getMe()
      .then(me => {
        spotify
          .createPlaylist(me.id, {
            name: name || 'New Playlist ' + Date.now()
          })
          .then(playlist => {
            let uris = [];
            const selection = this.state.selection;
            for (let id in selection) {
              uris.push(selection[id].uri);
            }

            // Only possible to do max of 100 tracks per addition so chunk it
            let promises = [];
            for (let i = 0; i < uris.length; i += MAX_TRACKS_PER_PLAYLIST_ADDITION) {
              let trackUris = uris.slice(i, i + MAX_TRACKS_PER_PLAYLIST_ADDITION);
              promises.push(spotify.addTracksToPlaylist(me.id, playlist.id, trackUris));
            }
            Promise.all(promises)
              .then(() => {
                this.setState({ state: states.PLAYLIST_CREATED });

                setTimeout(
                  () => {
                    if (this.state.state === states.PLAYLIST_CREATED) {
                      this.setState({ state: states.SELECTING });
                    }
                  },
                  2000
                );
              })
              .catch(() => {
                alert('Failed to add tracks to playlist ');
                this.setState({ state: states.SELECTING });
              });
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  _toggleTrack = track => {
    let selection = this.state.selection;
    if (selection[track.id]) {
      delete selection[track.id];
    } else {
      selection[track.id] = track;
    }

    this.setState({
      selection,
      selectionCount: this.state.selectionCount + (selection[track.id] ? 1 : -1),
      selectionDurationMs: this.state.selectionDurationMs +
        track.duration_ms * (selection[track.id] ? 1 : -1),
      mostRecentSelection: selection[track.id] ? track.id : null
    });
  };

  _toggleArtist = artist => {
    let selection = this.state.selection;

    let anyDeselected = artist.topTracks.some(track => {
      return !selection[track.id];
    });

    let changedCount = 0;
    artist.topTracks.forEach(track => {
      if (anyDeselected) {
        if (!selection[track.id]) {
          changedCount++;
          selection[track.id] = track;
        }
      } else if (selection[track.id]) {
        changedCount--;
        delete selection[track.id];
      }
    });

    this.setState({
      selection,
      selectionCount: this.state.selectionCount + changedCount,
      mostRecentSelection: null
    });
  };

  _handleScroll = (evt: any) => {
    this.setState({
      scrollX: this.state.scrollContext.scrollLeft,
      containerWidth: window.innerWidth
    });
  };

  _handleModalClose = () => {
    this.setState({ state: states.SELECTING });
  };

  _handleSelectAll = () => {
    this.setState(selectionMutator.selectAll(this.state.artists));
  };
  _handleSelectNone = () => {
    this.setState(selectionMutator.selectNone(this.state.artists));
  };
  _handleSelectRandom = () => {
    this.setState(selectionMutator.selectRandom(this.state.artists));
  };
  _handleSelectInitial = () => {
    this.setState(selectionMutator.selectIdentity(this.state.artists, this.state.initialSelection));
  };
  _handleSelectRecommended = () => {
    this.setState(selectionMutator.selectReverse(this.state.artists, this.state.initialSelection));
  };

  _formatDuration(timeMs) {
    let seconds = Math.floor(timeMs / 1000);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds / 60) % 60;
    let remainderSeconds = seconds % 60;

    let hoursString = hours > 0 ? hours + 'h' : '';
    let minutesString = minutes > 0 ? minutes + 'min' : '';
    let secondsString = hours === 0 && remainderSeconds > 0 ? remainderSeconds + 's' : '';

    return (hoursString + ' ' + minutesString).trim();
  }

  _fetchData() {
    dataFetcher(
      this.state.spotify,
      this.props.noCache,
      percentComplete => {
        this.setState({ percentComplete });
      },
      (finalState, callback) => {
        let newState = {
          ...finalState,
          ...selectionMutator.selectIdentity(finalState.artists, {
            ...this.state.selection,
            ...finalState.selection
          })
        };

        newState.initialSelection = newState.selection;

        this.setState(newState, callback);
      }
    );
  }
}

export default Main;
