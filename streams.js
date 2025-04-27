document.addEventListener('DOMContentLoaded', function() {
    const streamers = [
        {
            id: 'arligone',
            displayName: 'Arligone',
            defaultTitle: 'Jsuis trop nul',
            defaultGame: 'Sea of Thieves',
            channel: 'https://www.twitch.tv/arligone',
            avatar: 'images/arligone-card.jpg'
        },
        {
            id: 'redpeww',
            displayName: 'Redpeww',
            defaultTitle: 'Gaming avec style | Noctambule Team',
            defaultGame: 'Gaming',
            channel: 'https://www.twitch.tv/redpeww',
            avatar: 'images/redpeww-card.jpg'
        },
        {
            id: 'luzaga2',
            displayName: 'Luzaga',
            defaultTitle: 'Stream avec Luzaga | Noctambule Team',
            defaultGame: 'Gaming',
            channel: 'https://www.twitch.tv/luzaga2',
            avatar: 'images/luzaga-card.jpg'
        },
        {
            id: 'amnesya_tv',
            displayName: 'Amnesya',
            defaultTitle: 'Stream avec Amnesya | Noctambule Team',
            defaultGame: 'Gaming',
            channel: 'https://www.twitch.tv/amnesya_tv',
            avatar: 'images/default-avatar.jpg'
        }
    ];

    let embeds = {};
    let checkInterval = null;

    function initTwitchEmbeds() {
        // Nettoyer les anciens embeds s'ils existent
        Object.values(embeds).forEach(embedInfo => {
            if (embedInfo.container) {
                embedInfo.container.remove();
            }
        });
        embeds = {};

        // Nettoyer le conteneur de streams
        const liveStreamersContainer = document.getElementById('live-streamers');
        if (liveStreamersContainer) {
            liveStreamersContainer.innerHTML = '';
        }

        streamers.forEach(streamer => {
            const container = document.createElement('div');
            container.id = `twitch-embed-${streamer.id}`;
            container.style.position = 'absolute';
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            container.style.height = '1px';
            container.style.width = '1px';
            document.body.appendChild(container);

            const embed = new Twitch.Player(`twitch-embed-${streamer.id}`, {
                channel: streamer.id,
                width: '100%',
                height: '100%',
                muted: true,
                parent: [window.location.hostname]
            });

            embeds[streamer.id] = {
                player: embed,
                container: container,
                isLive: false,
                lastCheck: 0
            };

            embed.addEventListener(Twitch.Player.READY, () => {
                checkLiveStatus(streamer);
            });

            embed.addEventListener(Twitch.Player.ONLINE, () => {
                const currentTime = Date.now();
                if (currentTime - embeds[streamer.id].lastCheck > 5000) {
                    embeds[streamer.id].lastCheck = currentTime;
                    verifyStreamStatus(streamer);
                }
            });

            embed.addEventListener(Twitch.Player.OFFLINE, () => {
                embeds[streamer.id].isLive = false;
                removeStreamerCard(streamer.id);
                updateNoStreamsMessage();
            });

            embed.addEventListener(Twitch.Player.PLAY, () => {
                const currentTime = Date.now();
                if (currentTime - embeds[streamer.id].lastCheck > 5000) {
                    embeds[streamer.id].lastCheck = currentTime;
                    verifyStreamStatus(streamer);
                }
            });
        });

        // Vérifier le statut toutes les 30 secondes
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        checkInterval = setInterval(() => {
            streamers.forEach(streamer => checkLiveStatus(streamer));
        }, 30000);
    }

    function verifyStreamStatus(streamer) {
        const embedInfo = embeds[streamer.id];
        if (!embedInfo || !embedInfo.player || !embedInfo.player.getPlayer) return;

        try {
            const player = embedInfo.player.getPlayer();
            if (player && !player.isPaused() && player.getChannel()) {
                embedInfo.isLive = true;
                updateDisplay({
                    ...streamer,
                    isLive: true,
                    title: streamer.defaultTitle,
                    game: streamer.defaultGame,
                    viewers: 'En direct',
                    thumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.id}-320x180.jpg?${Date.now()}`
                });
            } else {
                embedInfo.isLive = false;
                removeStreamerCard(streamer.id);
                updateNoStreamsMessage();
            }
        } catch (error) {
            console.error(`Erreur lors de la vérification du stream de ${streamer.displayName}:`, error);
            embedInfo.isLive = false;
            removeStreamerCard(streamer.id);
            updateNoStreamsMessage();
        }
    }

    function removeStreamerCard(streamerId) {
        const card = document.querySelector(`[data-streamer-id="${streamerId}"]`);
        if (card) {
            card.remove();
        }
        updateNoStreamsMessage();
    }

    function updateNoStreamsMessage() {
        const liveStreamersContainer = document.getElementById('live-streamers');
        const noStreamsMessage = document.getElementById('no-streams');
        
        if (!liveStreamersContainer || !noStreamsMessage) return;

        const hasLiveStreamers = Object.values(embeds).some(embed => embed.isLive);
        
        if (!hasLiveStreamers) {
            noStreamsMessage.style.display = 'block';
            liveStreamersContainer.innerHTML = '';
        } else {
            noStreamsMessage.style.display = 'none';
        }
    }

    function checkLiveStatus(streamer) {
        const embedInfo = embeds[streamer.id];
        if (!embedInfo || !embedInfo.player) return;

        try {
            verifyStreamStatus(streamer);
        } catch (error) {
            console.error(`Erreur lors de la vérification du stream de ${streamer.displayName}:`, error);
            embedInfo.isLive = false;
            removeStreamerCard(streamer.id);
            updateNoStreamsMessage();
        }
    }

    function generateOfflineThumbnail(streamer) {
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
            <rect width="320" height="180" fill="%23000"/>
            <rect x="60" y="40" width="200" height="100" fill="%233b2668"/>
            <text x="160" y="90" text-anchor="middle" fill="%23fff" font-family="Arial" font-size="14">Hors ligne</text>
            <text x="160" y="110" text-anchor="middle" fill="%23fff" font-family="Arial" font-size="12">${streamer.displayName}</text>
        </svg>`;
    }

    function updateDisplay(streamerData) {
        if (!streamerData.isLive) {
            removeStreamerCard(streamerData.id);
            updateNoStreamsMessage();
            return;
        }

        const liveStreamersContainer = document.getElementById('live-streamers');
        if (!liveStreamersContainer) return;

        // Supprimer l'ancienne carte si elle existe
        removeStreamerCard(streamerData.id);

        const streamCard = document.createElement('div');
        streamCard.className = 'stream-card';
        streamCard.setAttribute('data-streamer-id', streamerData.id);
        streamCard.innerHTML = `
            <div class="stream-thumbnail">
                <img src="${streamerData.thumbnail}" alt="${streamerData.displayName}'s stream">
                <div class="viewer-count">
                    <svg viewBox="0 0 24 24" class="viewer-count-icon">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    ${streamerData.viewers}
                </div>
            </div>
            <div class="stream-card-info">
                <div class="streamer-info">
                    <img src="${streamerData.avatar}" alt="${streamerData.displayName}" class="streamer-avatar">
                    <div class="streamer-details">
                        <h4 class="stream-title">${streamerData.title}</h4>
                        <span class="streamer-name">${streamerData.displayName}</span>
                        <span class="game-name">${streamerData.game}</span>
                    </div>
                </div>
                <span class="live-badge">EN DIRECT</span>
            </div>
        `;
        
        streamCard.addEventListener('click', () => {
            window.open(streamerData.channel, '_blank');
        });
        
        liveStreamersContainer.appendChild(streamCard);
        updateNoStreamsMessage();

        // Mettre à jour le stream en vedette seulement si c'est le premier streamer en direct
        const isFirstLive = !document.querySelector('.stream-card:not([data-streamer-id="' + streamerData.id + '"])');
        if (isFirstLive) {
            updateFeaturedStream(streamerData);
        }
    }

    function updateFeaturedStream(streamerData) {
        const featuredTitle = document.getElementById('featured-title');
        const featuredStreamer = document.getElementById('featured-streamer');
        const featuredGame = document.getElementById('featured-game');
        const featuredViewers = document.getElementById('featured-viewers');
        const featuredChannelLink = document.getElementById('featured-channel-link');

        if (featuredTitle) featuredTitle.textContent = streamerData.title;
        if (featuredStreamer) featuredStreamer.textContent = streamerData.displayName;
        if (featuredGame) featuredGame.textContent = streamerData.game;
        if (featuredViewers) featuredViewers.textContent = streamerData.viewers;
        if (featuredChannelLink) featuredChannelLink.href = streamerData.channel;

        const featuredStream = document.getElementById('featured-stream');
        if (featuredStream && streamerData.isLive) {
            featuredStream.innerHTML = `
                <iframe
                    src="https://player.twitch.tv/?channel=${streamerData.id}&parent=${window.location.hostname}"
                    height="100%"
                    width="100%"
                    allowfullscreen>
                </iframe>
            `;
        } else if (featuredStream) {
            featuredStream.innerHTML = `
                <div class="offline-message">
                    <h3>${streamerData.displayName} est hors ligne</h3>
                    <p>Revenez plus tard !</p>
                </div>
            `;
        }
    }

    // Initialiser les embeds Twitch
    if (window.Twitch) {
        initTwitchEmbeds();
    } else {
        console.error('Twitch API not loaded');
        // Afficher le statut hors ligne par défaut pour tous les streamers
        streamers.forEach(streamer => {
            updateDisplay({
                ...streamer,
                isLive: false,
                title: streamer.defaultTitle,
                game: streamer.defaultGame,
                viewers: 'Hors ligne',
                thumbnail: generateOfflineThumbnail(streamer)
            });
        });
    }
});