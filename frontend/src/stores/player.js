"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlayerStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var axios_1 = require("axios");
exports.usePlayerStore = (0, pinia_1.defineStore)('player', function () {
    var audio = new Audio();
    var isPlaying = (0, vue_1.ref)(false);
    var currentTime = (0, vue_1.ref)(0);
    var duration = (0, vue_1.ref)(0);
    var volume = (0, vue_1.ref)(0.8);
    var playlist = (0, vue_1.ref)([]);
    var currentIndex = (0, vue_1.ref)(-1);
    var showPlayer = (0, vue_1.ref)(false);
    var isExpanded = (0, vue_1.ref)(false); // Global expand state
    function expandPlayer() {
        isExpanded.value = true;
    }
    function collapsePlayer() {
        isExpanded.value = false;
    }
    // Lyrics State
    var lyrics = (0, vue_1.ref)([]);
    var currentLyricIndex = (0, vue_1.ref)(-1);
    var currentTrack = (0, vue_1.computed)(function () {
        if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
            return playlist.value[currentIndex.value];
        }
        return null;
    });
    var currentLyricLine = (0, vue_1.computed)(function () {
        if (currentLyricIndex.value >= 0 && currentLyricIndex.value < lyrics.value.length) {
            return lyrics.value[currentLyricIndex.value];
        }
        return null;
    });
    var progressPercent = (0, vue_1.computed)(function () {
        if (duration.value > 0) {
            return (currentTime.value / duration.value) * 100;
        }
        return 0;
    });
    // Initialize Audio Events
    audio.addEventListener('timeupdate', function () {
        currentTime.value = audio.currentTime;
        updateLyricIndex();
    });
    audio.addEventListener('durationchange', function () {
        duration.value = audio.duration;
    });
    audio.addEventListener('ended', function () {
        next();
    });
    function updateLyricIndex() {
        if (!lyrics.value.length)
            return;
        // Find the active lyric line
        // We look for the last line where time <= currentTime
        var idx = -1;
        for (var i = 0; i < lyrics.value.length; i++) {
            if (lyrics.value[i].time <= currentTime.value) {
                idx = i;
            }
            else {
                break;
            }
        }
        currentLyricIndex.value = idx;
    }
    function play(track) {
        return __awaiter(this, void 0, void 0, function () {
            var idx, playPromise;
            var _a;
            return __generator(this, function (_b) {
                // If same track, just toggle
                if (((_a = currentTrack.value) === null || _a === void 0 ? void 0 : _a.id) === track.id) {
                    togglePlay();
                    return [2 /*return*/];
                }
                idx = playlist.value.findIndex(function (t) { return t.id === track.id; });
                if (idx === -1) {
                    // Add to end and play
                    playlist.value.push(track);
                    currentIndex.value = playlist.value.length - 1;
                }
                else {
                    currentIndex.value = idx;
                }
                // Reset
                audio.src = track.url;
                audio.volume = volume.value;
                showPlayer.value = true;
                try {
                    console.log('Audio playing...', audio.src);
                    playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function () {
                            isPlaying.value = true;
                            fetchLyrics(track);
                        }).catch(function (e) {
                            console.error('Audio play failed (promise):', e);
                        });
                    }
                }
                catch (e) {
                    console.error('Playback failed immediately', e);
                }
                return [2 /*return*/];
            });
        });
    }
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            isPlaying.value = true;
        }
        else {
            audio.pause();
            isPlaying.value = false;
        }
    }
    function next() {
        if (playlist.value.length === 0)
            return;
        var nextIdx = currentIndex.value + 1;
        if (nextIdx >= playlist.value.length)
            nextIdx = 0; // Loop
        play(playlist.value[nextIdx]);
    }
    function prev() {
        if (playlist.value.length === 0)
            return;
        var prevIdx = currentIndex.value - 1;
        if (prevIdx < 0)
            prevIdx = playlist.value.length - 1;
        play(playlist.value[prevIdx]);
    }
    function seek(time) {
        audio.currentTime = time;
        currentTime.value = time;
    }
    function setVolume(v) {
        volume.value = Math.max(0, Math.min(1, v));
        audio.volume = volume.value;
    }
    // Lyrics Parser: [00:12.34]Lyric Text
    function fetchLyrics(track) {
        return __awaiter(this, void 0, void 0, function () {
            var res, rawLrc, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lyrics.value = [];
                        currentLyricIndex.value = -1;
                        // Try to find .lrc with same name
                        // Implementation note: This assumes the lrc file exists and we can find it.
                        // For simplicity, we might just assume the user uploaded it and the UI found it.
                        // Or we search via backend.
                        // For this version: we rely on `track.lyricsUrl` being populated by the view logic.
                        if (!track.lyricsUrl)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(track.lyricsUrl)];
                    case 2:
                        res = _a.sent();
                        rawLrc = res.data;
                        if (typeof rawLrc === 'string') {
                            lyrics.value = parseLrc(rawLrc);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.warn('No lyrics found via URL', track.lyricsUrl);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function parseLrc(lrc) {
        var lines = lrc.split('\n');
        var result = [];
        var timeReg = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?\]/;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var match = timeReg.exec(line);
            if (match) {
                var min = parseInt(match[1]);
                var sec = parseInt(match[2]);
                var ms = match[4] ? parseInt(match[4].padEnd(3, '0').slice(0, 3)) : 0;
                var time = min * 60 + sec + ms / 1000;
                var text = line.replace(timeReg, '').trim();
                if (text) {
                    result.push({ time: time, text: text });
                }
            }
        }
        return result;
    }
    return {
        audio: audio, // Expose for advanced viz
        isPlaying: isPlaying,
        currentTime: currentTime,
        duration: duration,
        volume: volume,
        playlist: playlist,
        currentTrack: currentTrack,
        lyrics: lyrics,
        currentLyricIndex: currentLyricIndex,
        currentLyricLine: currentLyricLine,
        progressPercent: progressPercent,
        showPlayer: showPlayer,
        isExpanded: isExpanded,
        expandPlayer: expandPlayer,
        collapsePlayer: collapsePlayer,
        play: play,
        togglePlay: togglePlay,
        next: next,
        prev: prev,
        seek: seek,
        setVolume: setVolume
    };
});
