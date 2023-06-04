(function(){
    var script = {
 "mouseWheelEnabled": true,
 "layout": "absolute",
 "start": "this.init()",
 "data": {
  "name": "Player1771"
 },
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "paddingLeft": 0,
 "vrPolyfillScale": 0.61,
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "minHeight": 20,
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer"
 ],
 "minWidth": 20,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "mobileMipmappingEnabled": false,
 "defaultVRPointer": "laser",
 "scripts": {
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "registerKey": function(key, value){  window[key] = value; },
  "unregisterKey": function(key){  delete window[key]; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "existsKey": function(key){  return key in window; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "shadow": false,
 "height": "100%",
 "downloadEnabled": false,
 "gap": 10,
 "paddingTop": 0,
 "paddingRight": 0,
 "borderRadius": 0,
 "horizontalAlign": "left",
 "paddingBottom": 0,
 "class": "Player",
 "definitions": [{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 36.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_957D5ECC_85C5_FAB1_41D3_24F5EB38B14A"
},
{
 "items": [
  {
   "media": "this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_771F0294_7D7A_BEA9_4184_B29C074C4714",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A901509_8169_D018_41B2_80398562CF8E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A901509_8169_D018_41B2_80398562CF8E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A929617_8169_B008_41D4_B1BB387D2CDD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A909718_8168_5039_41D3_6144A42FFF11",
   "camera": "this.panorama_8A909718_8168_5039_41D3_6144A42FFF11_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "hfov": 360,
 "label": "011",
 "adjacentPanoramas": [
  {
   "yaw": 41.45,
   "backwardYaw": -115.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E",
   "distance": 1
  },
  {
   "yaw": -134.4,
   "backwardYaw": -84.66,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_t.jpg",
 "id": "panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_93BB9B04_81A8_7008_41D4_0B41F906CCF6",
  "this.overlay_94BF311E_81A8_5039_41BE_1B6C4B943999",
  "this.overlay_944FF93C_81A8_F079_41C1_75B329C676DD",
  "this.overlay_92802A89_81A8_B01B_41BC_31DF038F7634",
  "this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -150.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94674FB8_85C5_FAD1_41C9_35A7E6F213DD"
},
{
 "hfov": 360,
 "label": "025",
 "adjacentPanoramas": [
  {
   "yaw": 107.02,
   "backwardYaw": -48.49,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B",
   "distance": 1
  },
  {
   "yaw": -41.07,
   "backwardYaw": 85.29,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A901509_8169_D018_41B2_80398562CF8E",
   "distance": 1
  },
  {
   "yaw": 14.82,
   "backwardYaw": -1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_t.jpg",
 "id": "panorama_8A97757C_8169_B0F9_41BE_F1769D222827",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A25A0154_8398_6DD8_41C8_F20D7EEBF891",
  "this.overlay_A3B0D180_8398_AD38_41A7_9B122ED4F83C",
  "this.overlay_A23B491F_8399_FD47_41D9_6A62D4F0CF8E",
  "this.overlay_A36A1636_8398_5758_41D7_2056F46AB954",
  "this.overlay_A0ADDB46_839F_BD39_41DB_8374363077AF",
  "this.overlay_A30C04CF_839F_D4C8_41DA_C5F8407B21CC",
  "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -179.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_951E0EED_85C5_FA70_41CC_6611D432706F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_camera"
},
{
 "hfov": 360,
 "label": "016",
 "adjacentPanoramas": [
  {
   "yaw": 160.15,
   "backwardYaw": -26.5,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_t.jpg",
 "id": "panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9877FC35_8299_DB58_41D5_9C90666F0445",
  "this.overlay_9EFC4778_8298_75CA_41DC_E506F6D687A8",
  "this.panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -75.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AD3C06A_85C5_E670_41CC_C89EF0474AE1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 176.61,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_97E3000A_85C5_E5B1_41D6_6AE38B5D8B7B"
},
{
 "hfov": 360,
 "label": "003",
 "adjacentPanoramas": [
  {
   "yaw": 48.11,
   "backwardYaw": 108.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578",
   "distance": 1
  },
  {
   "yaw": 163.92,
   "backwardYaw": 68.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
   "distance": 1
  },
  {
   "yaw": -160.91,
   "backwardYaw": 68.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
   "distance": 1
  },
  {
   "yaw": -62.68,
   "backwardYaw": -149.23,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE",
   "distance": 1
  },
  {
   "yaw": 127.12,
   "backwardYaw": 107.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB",
   "distance": 1
  },
  {
   "yaw": -15.95,
   "backwardYaw": -3.39,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_t.jpg",
 "id": "panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_73FDFBF7_7D8F_8E57_41D5_C6644A4B3E5F",
  "this.overlay_734F255A_7D8E_9A59_41B7_5524BDBF6CED",
  "this.overlay_72EE4A79_7D8D_8E5A_41D6_407DC4DA4E56",
  "this.overlay_6D896540_7D8B_FBA9_41DC_94EF3FB8C83D",
  "this.overlay_6D127D82_7D8B_8AAE_41D1_B99F1905795B",
  "this.overlay_6D3D049E_7D95_FAD6_41D9_427BB529862F",
  "this.overlay_9B126B25_8169_BD78_41DA_BDCD3C344C27",
  "this.overlay_9DDDD1D9_8168_ECCB_41D3_8450457CCB9B",
  "this.overlay_9DB7FA2F_8168_FF48_41DF_FDCE022D0F4D",
  "this.overlay_984C6800_8168_DB38_41D2_BC5D944268B4",
  "this.overlay_98317F46_8298_5538_41B5_E0541819AB8E",
  "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 175.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_948B7F7A_85C5_FA51_41CB_A8E291A7A959"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_camera"
},
{
 "hfov": 360,
 "label": "027",
 "adjacentPanoramas": [
  {
   "yaw": 67.33,
   "backwardYaw": -122.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212",
   "distance": 1
  },
  {
   "yaw": -70.47,
   "backwardYaw": 25.5,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A929617_8169_B008_41D4_B1BB387D2CDD",
   "distance": 1
  },
  {
   "yaw": -1,
   "backwardYaw": 14.82,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_t.jpg",
 "id": "panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A4F31E47_8398_B7C7_41CE_D6B704721A7C",
  "this.overlay_A49CAC6D_8398_FBC8_41DE_058CC222A880",
  "this.overlay_A630ACE3_8399_D4FF_41D5_3124667A3C37",
  "this.overlay_A6CE33CD_8368_ACCB_41BD_4CB00668EA77",
  "this.overlay_96475C48_852B_6873_41DE_7F200E8B0ED0",
  "this.overlay_914776F6_8525_B81F_41B8_ED60501C8558",
  "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 57.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_953E1F12_85C5_FBD0_41DE_D098548609F6"
},
{
 "hfov": 360,
 "label": "014",
 "adjacentPanoramas": [
  {
   "yaw": 66.2,
   "backwardYaw": -37.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1",
   "distance": 1
  },
  {
   "yaw": -26.5,
   "backwardYaw": 160.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5",
   "distance": 1
  },
  {
   "yaw": 137.67,
   "backwardYaw": -4.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE",
   "distance": 1
  },
  {
   "yaw": -125.36,
   "backwardYaw": -83.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5",
   "distance": 1
  },
  {
   "yaw": 21.61,
   "backwardYaw": 96.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96",
   "distance": 1
  },
  {
   "yaw": 117.57,
   "backwardYaw": -68.46,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD",
   "distance": 1
  },
  {
   "yaw": -13.69,
   "backwardYaw": -0.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_t.jpg",
 "id": "panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_95E3471F_81A8_7037_41B8_5E36F72A8049",
  "this.overlay_9525D475_81A8_D00B_41D1_A14EBBAFBC08",
  "this.overlay_95EED355_81B8_B008_41DA_9F9BAC021158",
  "this.overlay_942914A0_8198_5009_41CC_697F67B0E846",
  "this.overlay_9404F3D0_8198_5009_41BF_7C5D39B08CD2",
  "this.overlay_9410D58C_819B_F019_41DA_D3E0CEE6DFE9",
  "this.overlay_955BBBAD_8198_7018_41DF_AF9B7590296B",
  "this.overlay_941E13EC_8198_D019_41AE_506D1C3B932B",
  "this.overlay_97DFA2F6_81E8_B009_41DC_D12777ADF4AB",
  "this.overlay_9721E75B_81E8_B03F_41D3_94FD3B4142E4",
  "this.overlay_973098AF_81E8_B017_41D0_8E087DC43471",
  "this.overlay_971C62C5_81F7_B008_41B0_BB67B8DCCEF5",
  "this.overlay_97B61CCE_81F8_7018_41DD_69D2A728C253",
  "this.overlay_9703A5E4_81F8_B008_41D9_78BB2A50C87E",
  "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -42.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B108D21_85C5_FFF3_41B3_EAA7758BF2F7"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -16.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A910DA8_85C5_FEF1_41C5_8B3117CC8FBA"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -57.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_954CDEBB_85C5_FAD7_41CB_95601E4DAE91"
},
{
 "hfov": 360,
 "label": "012",
 "adjacentPanoramas": [
  {
   "yaw": -84.66,
   "backwardYaw": -134.4,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_t.jpg",
 "id": "panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_931CCA9C_81A9_D038_41D2_F4A44AFCBBC1",
  "this.overlay_955FDE0B_81A8_701F_41D8_B9A530AE610E",
  "this.panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_camera"
},
{
 "hfov": 360,
 "label": "015",
 "adjacentPanoramas": [
  {
   "yaw": -83.53,
   "backwardYaw": -125.36,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_t.jpg",
 "id": "panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9813D437_8298_6B58_41D3_443E8766BB88",
  "this.overlay_993BDB77_8298_DDD8_41DE_72E805778C93",
  "this.panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 164.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A2B9E41_85C5_FDB3_41D3_5E2EEED53000"
},
{
 "hfov": 360,
 "label": "013",
 "adjacentPanoramas": [
  {
   "yaw": -4.65,
   "backwardYaw": 137.67,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  },
  {
   "yaw": -149.23,
   "backwardYaw": -62.68,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  },
  {
   "yaw": 158.52,
   "backwardYaw": -62.68,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_t.jpg",
 "id": "panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_928AD8D6_81A8_7008_41D0_C1FC01C4405A",
  "this.overlay_921D394D_81A8_F01B_41DF_AC4FC07B5B14",
  "this.overlay_97318FC9_81AB_D01B_419A_83E27656B6A4",
  "this.overlay_95C8C8A7_81A8_B017_41A2_B04FF1B0673C",
  "this.overlay_948185A7_81A8_D008_41DF_883A5D7FA141",
  "this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -158.39,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95524E9E_85C5_FAD1_41B7_D2D6879DE77B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 167.69,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95B2BE8B_85C5_FAB7_4191_2FA2F31D5C31"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -51.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95D45E4A_85C5_FDB1_41CD_08F3348750AE"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 39.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95E7EE69_85C5_FA73_41DE_0659A4C7250F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -111.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94229FE2_85C5_FA71_41C1_F61BEA4C201F"
},
{
 "hfov": 360,
 "label": "009",
 "adjacentPanoramas": [
  {
   "yaw": -67.83,
   "backwardYaw": 89.43,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E",
   "distance": 1
  },
  {
   "yaw": 107.15,
   "backwardYaw": -140.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_t.jpg",
 "id": "panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_90DAC027_8198_5017_41D5_AB58C81E27B9",
  "this.overlay_90378D00_819B_D008_41A8_81F6BFAF62D4",
  "this.overlay_93C33366_8198_5009_41D8_F71B9D8FC7A0",
  "this.overlay_93351E0B_8198_7018_41C9_CF0A448F730F",
  "this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_tcap0"
 ]
},
{
 "hfov": 360,
 "label": "022",
 "adjacentPanoramas": [
  {
   "yaw": 122.97,
   "backwardYaw": -8.29,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711",
   "distance": 1
  },
  {
   "yaw": -68.46,
   "backwardYaw": 117.57,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_t.jpg",
 "id": "panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9F6DA9E2_8378_5CF9_41A0_71F619AEE844",
  "this.overlay_9C7B3272_8378_AFD8_41DD_90D962425786",
  "this.overlay_9F46C149_8378_EDCB_41D8_E9C90E4E9907",
  "this.overlay_9C3AF45B_8378_6BCF_41C7_E1BDE9F74528",
  "this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 74.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94179FC2_85C5_FAB1_41DE_E68C0F64D03B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 143.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B21904B_85C5_E5B0_41C0_470462E08F8C"
},
{
 "hfov": 360,
 "label": "032",
 "adjacentPanoramas": [
  {
   "yaw": 128.63,
   "backwardYaw": -57.91,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_t.jpg",
 "id": "panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A7687A95_8369_FF5B_41C7_F1899E466B9F",
  "this.overlay_A53DE1A7_8368_6D78_41D2_5FAD89CBD6EF",
  "this.panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 111.54,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_9456DF99_85C5_FAD3_41C7_44028A448356"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -72.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A024E21_85C5_FDF3_41B7_39373C62579F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -45.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AB67DC5_85C5_FEB0_41D7_4175F9D4B883"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 117.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AF3CD86_85C5_FEB1_41A0_F155C7668829"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A909718_8168_5039_41D3_6144A42FFF11_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -72.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_97CCD001_85C5_E5B3_41CB_11312468AB0D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -72.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B33CD4A_85C5_FFB1_41C9_5F6EA95B7237"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -52.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AC6AD7D_85C5_FE53_41D4_184268F6AB57"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -174.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95C62E55_85C5_FA53_41DC_2108E6E76A29"
},
{
 "hfov": 360,
 "label": "026",
 "adjacentPanoramas": [
  {
   "yaw": 85.29,
   "backwardYaw": -41.07,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E"
  }
 ],
 "thumbnailUrl": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_t.jpg",
 "id": "panorama_8A901509_8169_D018_41B2_80398562CF8E",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A35B246F_8398_6BC7_41D7_9313765C8B4B",
  "this.overlay_A3034EF5_8398_54DB_41D9_D023AFEA4371",
  "this.overlay_A07B8D05_8398_553B_41A7_0022391C95B0",
  "this.overlay_A013F935_8398_5D5B_41DD_C1A97045E371",
  "this.panorama_8A901509_8169_D018_41B2_80398562CF8E_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -165.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94D89F31_85C5_FBD0_41C0_56AA56103904"
},
{
 "hfov": 360,
 "label": "004",
 "adjacentPanoramas": [
  {
   "yaw": 68.21,
   "backwardYaw": 163.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  },
  {
   "yaw": -137.79,
   "backwardYaw": 24.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB",
   "distance": 1
  },
  {
   "yaw": 143.45,
   "backwardYaw": 24.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB",
   "distance": 1
  },
  {
   "yaw": 4.02,
   "backwardYaw": 134.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_t.jpg",
 "id": "panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_72EADB23_7D95_8FEE_41C9_8B758F5D2161",
  "this.overlay_7256A1A9_7D95_9AFA_41B5_8E9F2B5D84C9",
  "this.overlay_722DF1FE_7D96_FA56_41D3_7404D9782CAE",
  "this.overlay_8CE6A942_8178_D008_41DC_1D830ACBFF83",
  "this.overlay_8F79E4D7_8178_5037_41DF_81CB9EECA832",
  "this.overlay_AC264486_8299_EB38_41BC_E027A2ED9A9D",
  "this.overlay_AE370B8A_8298_5D48_41C9_7FE690649B7C",
  "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 164.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94C95F40_85C5_FBB0_41B4_3FC76A40BD59"
},
{
 "hfov": 360,
 "label": "008",
 "adjacentPanoramas": [
  {
   "yaw": 89.43,
   "backwardYaw": -67.83,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD",
   "distance": 1
  },
  {
   "yaw": -115.94,
   "backwardYaw": 41.45,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB",
   "distance": 1
  },
  {
   "yaw": -12.31,
   "backwardYaw": 43.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F"
  }
 ],
 "thumbnailUrl": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_t.jpg",
 "id": "panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_8EDA470B_8168_D018_41D3_C9E990B37632",
  "this.overlay_914464C8_8168_5018_41BC_D37B7DAB459D",
  "this.overlay_90D3094C_8169_B018_41D8_43241B441DBE",
  "this.overlay_9190587D_8169_F0F8_41C7_FB21A93AF16D",
  "this.overlay_936BA722_8168_B009_41C1_02E08FB9DF8A",
  "this.overlay_905D113A_8168_B079_41CF_6393080F4C02",
  "this.overlay_903829EA_8198_B019_41DA_CB0B06B28176",
  "this.overlay_90462230_8199_D009_41CF_0C0A4A523C5F",
  "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 128.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A5EEDE4_85C5_FE70_41B5_E6D4DA0DAA0D"
},
{
 "hfov": 360,
 "label": "017",
 "adjacentPanoramas": [
  {
   "yaw": -62.05,
   "backwardYaw": 104.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689",
   "distance": 1
  },
  {
   "yaw": -143.7,
   "backwardYaw": 14.82,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743",
   "distance": 1
  },
  {
   "yaw": -0.38,
   "backwardYaw": -13.69,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_t.jpg",
 "id": "panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_989B22BA_8298_AF48_41DC_518D45DC65E2",
  "this.overlay_9F4329EF_829B_FCC8_41C2_BF1720CB068A",
  "this.overlay_99980071_8298_ABD8_41A4_899BAED7C851",
  "this.overlay_9E475680_8299_B738_41B3_9F03063F50B2",
  "this.overlay_9EB3516A_82E9_ADC9_41DC_7116D5919D22",
  "this.overlay_9E2C455A_82E8_D5C9_4198_0E856C091C19",
  "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 45.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95904E73_85C5_FA57_41CA_2FFB994906C2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_camera"
},
{
 "hfov": 360,
 "label": "021",
 "adjacentPanoramas": [
  {
   "yaw": -8.29,
   "backwardYaw": 122.97,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_t.jpg",
 "id": "panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9E0C0726_837B_B579_41D8_CDBE61B5637B",
  "this.overlay_9F3BB4DB_8378_D4C8_41D7_D989A9A009F7",
  "this.panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_tcap0"
 ]
},
{
 "hfov": 360,
 "label": "002",
 "adjacentPanoramas": [
  {
   "yaw": -137.67,
   "backwardYaw": -66.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366",
   "distance": 1
  },
  {
   "yaw": 108.65,
   "backwardYaw": 48.11,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_t.jpg",
 "id": "panorama_77253312_7D7B_FFAE_41B1_09F420FC7578",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_70779DD7_7D8E_8A57_41B0_7BAE180998F7",
  "this.overlay_734E0099_7D8E_BADB_41D8_0D3B7BBFB44D",
  "this.overlay_A927C895_8368_DB58_41CD_60103D37B01D",
  "this.overlay_AEA7B472_8368_6BD8_4181_6A85637724DE",
  "this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_tcap0"
 ]
},
{
 "hfov": 360,
 "label": "018",
 "adjacentPanoramas": [
  {
   "yaw": 14.82,
   "backwardYaw": -143.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_t.jpg",
 "id": "panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_99330E57_8297_B7C7_41BF_3EA84A30FFBD",
  "this.overlay_9E7232E5_8298_ECFB_41BE_636A4F759F3A",
  "this.panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 113.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A7B4DF8_85C5_FE50_41CB_E909F3BC9F4B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -155.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A9D0DB2_85C5_FED1_41D9_D45761ED5D8C"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -113.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94F91F53_85C5_FA57_41D9_164B5EE8D571"
},
{
 "hfov": 360,
 "label": "020",
 "adjacentPanoramas": [
  {
   "yaw": 96.09,
   "backwardYaw": 21.61,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_t.jpg",
 "id": "panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9E589833_8298_DB5F_41D9_A4E820BF786A",
  "this.overlay_9F695323_8378_ED78_41D9_8991C5AC747C",
  "this.panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_tcap0"
 ]
},
{
 "hfov": 360,
 "label": "029",
 "adjacentPanoramas": [
  {
   "yaw": 25.5,
   "backwardYaw": -70.47,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_t.jpg",
 "id": "panorama_8A929617_8169_B008_41D4_B1BB387D2CDD",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A156154E_8397_D5C8_41B0_519251D0FB8B",
  "this.overlay_A74FB73B_8397_B548_41D3_4689E9146717",
  "this.panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_tcap0"
 ]
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 121.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AA03DCF_85C5_FEB0_418F_50CB70136297"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 143.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B25D055_85C5_E650_41DD_8F3B66291CF1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 179,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AD3BD68_85C5_FE71_41D7_FE87BA7086AB"
},
{
 "hfov": 360,
 "label": "028",
 "adjacentPanoramas": [
  {
   "yaw": -122.09,
   "backwardYaw": 67.33,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_t.jpg",
 "id": "panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A18E4B52_8398_5DD8_41D2_6D7F6B94C3F2",
  "this.overlay_A762ECCD_8398_D4C8_41D0_58F778070AE9",
  "this.panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -90.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95F7FE5F_85C5_FA4F_41B4_464BBF8D714B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -154.5,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_9528EF21_85C5_FBF0_41B4_AF5168180BB8"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 142.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94EB9F63_85C5_FA77_41DB_C387373D31B2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 54.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_955CFEA8_85C5_FAF1_41DD_7ECCE6283C61"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 138.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AC16087_85C5_E6BF_41A5_A493E9C245B8"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -158.39,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94001FCE_85C5_FAB1_41CA_B94491A8A8D2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 49.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_950E2F02_85C5_FBB0_41E0_40B8E1F3320A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_camera"
},
{
 "hfov": 360,
 "label": "033",
 "adjacentPanoramas": [
  {
   "yaw": 146.09,
   "backwardYaw": -36.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
   "distance": 1
  },
  {
   "yaw": -155.88,
   "backwardYaw": -36.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
   "distance": 1
  },
  {
   "yaw": 0.88,
   "backwardYaw": -97.1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_t.jpg",
 "id": "panorama_8A926437_8168_F008_41D2_D6CCDFAF0570",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A9A6C756_8379_B5D9_41BE_FF4313A91737",
  "this.overlay_AEB97B5C_8379_DDC8_41D8_729D933E4FF2",
  "this.overlay_AA79EACD_8378_DCCB_41CF_A9F98C5B9BA0",
  "this.overlay_AB8F44ED_8378_B4C8_41C4_48EC4518BE10",
  "this.overlay_AA94F67E_837B_D7C8_41CB_91EEF5C51A20",
  "this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 171.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AF86D91_85C5_FED3_41DC_7BBEDAFF2725"
},
{
 "hfov": 360,
 "label": "019",
 "adjacentPanoramas": [
  {
   "yaw": 104.26,
   "backwardYaw": -62.05,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_t.jpg",
 "id": "panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_99887AF1_8299_BCDB_41C2_0A168547820F",
  "this.overlay_9C6BBFE1_8299_D4F8_41DC_84DBD5AFBFE6",
  "this.panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 166.31,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8ADF007D_85C5_E653_419C_07D157A55B06"
},
{
 "hfov": 360,
 "label": "024",
 "adjacentPanoramas": [
  {
   "yaw": -15.2,
   "backwardYaw": 8.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1",
   "distance": 1
  },
  {
   "yaw": -48.49,
   "backwardYaw": 107.02,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827",
   "distance": 1
  },
  {
   "yaw": 29.52,
   "backwardYaw": 121.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_t.jpg",
 "id": "panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9C71E56F_83F9_F5C8_41AA_A6227F7C30FA",
  "this.overlay_A2BFF925_8399_DD78_41D5_D3D42B58F5A1",
  "this.overlay_A3B2BF1C_8398_7548_41CE_D501E06125F9",
  "this.overlay_9D74F549_8398_D5C8_41C6_0FBD289B8F43",
  "this.overlay_A3D5E468_8398_ABC8_41C0_2A224F0AC887",
  "this.overlay_A0C62A7B_8398_FFC8_41DB_A3BD3106F5EC",
  "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_camera"
},
{
 "hfov": 360,
 "label": "010",
 "adjacentPanoramas": [
  {
   "yaw": -140.18,
   "backwardYaw": 107.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_t.jpg",
 "id": "panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_90195315_8198_F008_419B_4983981E5263",
  "this.overlay_93B9F8AE_8198_7019_41C3_9383BC07FB3B",
  "this.panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 109.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AACBDDA_85C5_FE50_41C5_6A81D38B4B06"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 64.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95D6ECEC_85C5_FE71_41DB_898A765EF187"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -33.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94775FAD_85C5_FAF3_41D4_70B3141B7889"
},
{
 "hfov": 360,
 "label": "006",
 "adjacentPanoramas": [
  {
   "yaw": 43.96,
   "backwardYaw": -12.31,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E",
   "distance": 1
  },
  {
   "yaw": 134.78,
   "backwardYaw": 4.02,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
   "distance": 1
  },
  {
   "yaw": -58.16,
   "backwardYaw": 21.61,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771F0294_7D7A_BEA9_4184_B29C074C4714",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_t.jpg",
 "id": "panorama_77125FF3_7D7A_866E_41D3_CE47580C665C",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_8E7929FB_8178_B3F8_41C0_6CB814FED217",
  "this.overlay_8E9DF0DB_8178_503F_41B9_B632C715B6F4",
  "this.overlay_8E42623B_817F_D07F_41DE_B5E093AF9FAE",
  "this.overlay_913E0BEC_8169_F018_41C4_02AE0F144989",
  "this.overlay_8EBA62C6_8168_D009_41DF_966BD4F3FD6B",
  "this.overlay_91CBB708_8168_5018_41E0_188511617BB9",
  "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -171.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A11CE16_85C5_FDD1_41C2_38A9904E277C"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 82.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B298060_85C5_E670_41DB_99DCABACF1E0"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -62.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AE45D9D_85C5_FED3_41D1_9B96C6DE8AAD"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -112.67,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_956D5EDC_85C5_FA51_41C6_933B198011A5"
},
{
 "hfov": 360,
 "label": "023",
 "adjacentPanoramas": [
  {
   "yaw": 8.92,
   "backwardYaw": -15.2,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B",
   "distance": 1
  },
  {
   "yaw": -37.93,
   "backwardYaw": 66.2,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_t.jpg",
 "id": "panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_9F98E9C6_8378_BD38_41D6_B8050DDA1760",
  "this.overlay_9CDA49BF_837B_BD48_41C3_FA9C7E1899B5",
  "this.overlay_A2233554_8378_D5D8_41AD_161491A09A04",
  "this.overlay_9DEB64E5_83F8_54F8_41D0_3B6B1019858B",
  "this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_tcap0"
 ]
},
{
 "hfov": 360,
 "label": "035",
 "adjacentPanoramas": [
  {
   "yaw": -130.64,
   "backwardYaw": -51.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4",
   "distance": 1
  },
  {
   "yaw": 161.54,
   "backwardYaw": -51.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_t.jpg",
 "id": "panorama_8A909718_8168_5039_41D3_6144A42FFF11",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_AA7F4DBF_8378_D548_41BF_6291CD6F97DE",
  "this.overlay_AA2B0335_8378_AD58_41DD_5FE2F4C8E887",
  "this.overlay_AF1EEDD5_8378_D4D8_41C7_E46A310DE7CE",
  "this.panorama_8A909718_8168_5039_41D3_6144A42FFF11_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -136.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A257CE3_85C5_FE70_41C0_EA2B1B66B715"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_camera"
},
{
 "hfov": 360,
 "label": "001",
 "adjacentPanoramas": [
  {
   "yaw": -66.95,
   "backwardYaw": -137.67,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578",
   "distance": 1
  },
  {
   "yaw": -3.39,
   "backwardYaw": -15.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_t.jpg",
 "id": "panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_700C1DF2_7D8B_8A69_41D4_8F7D589C41A0",
  "this.overlay_711CCE18_7D8B_89DA_41D5_8B8B2B2F070F",
  "this.overlay_A94A7237_8368_6F47_41B0_49DFF5AC8AE7",
  "this.overlay_A91148AC_8368_5B49_41D6_70026EEB6520",
  "this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 112.17,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A0C9CCE_85C5_FEB0_419A_8A68BB954D6B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 117.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B144D2C_85C5_FFF1_41C7_78460B5F6784"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 96.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94B47F85_85C5_FAB3_41D2_906A5FEBAFB0"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A97757C_8169_B0F9_41BE_F1769D222827_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -94.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B265D5F_85C5_FE4F_41E0_70940F4E2559"
},
{
 "hfov": 360,
 "label": "034",
 "adjacentPanoramas": [
  {
   "yaw": -97.1,
   "backwardYaw": 0.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570",
   "distance": 1
  },
  {
   "yaw": -51.25,
   "backwardYaw": -130.64,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A909718_8168_5039_41D3_6144A42FFF11",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_t.jpg",
 "id": "panorama_8A9651C3_8168_B008_41D1_35265ABE32B4",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A585B6A4_8378_5778_41DD_AB165E612C94",
  "this.overlay_AAFBC23E_8378_6F49_41D1_CDB01D7FF780",
  "this.overlay_AE9A82D4_8378_ACD8_41DE_50B83D2A1591",
  "this.overlay_AB4B788B_8378_5B48_41D2_1010B84B9482",
  "this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 42.21,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AD94D73_85C5_FE57_41AE_C6E47D91DDAB"
},
{
 "hfov": 360,
 "label": "007",
 "adjacentPanoramas": [
  {
   "yaw": 21.61,
   "backwardYaw": -58.16,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_t.jpg",
 "id": "panorama_771F0294_7D7A_BEA9_4184_B29C074C4714",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_8E20AC5D_8179_F038_41CE_76C7B76D7946",
  "this.overlay_8ECC1148_8177_B019_41C2_5958D7F64A0D",
  "this.panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 95.34,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B6DFD17_85C5_FFDF_41C0_B1057DAE22AD"
},
{
 "hfov": 360,
 "label": "030",
 "adjacentPanoramas": [
  {
   "yaw": -36.93,
   "backwardYaw": 146.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570",
   "distance": 1
  },
  {
   "yaw": 121.09,
   "backwardYaw": 29.52,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B",
   "distance": 1
  },
  {
   "yaw": 5.53,
   "backwardYaw": -105.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_t.jpg",
 "id": "panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A65D2455_836B_EBD8_41D7_79C0451C5FE7",
  "this.overlay_A7EC9E24_836B_B745_41DB_96CC40F1AA43",
  "this.overlay_A7D3D2C2_8368_AF38_41DB_798703D28E1D",
  "this.overlay_A773A85E_8368_FBC8_41BF_81C030FE0434",
  "this.overlay_902C1156_853F_B81E_41D4_0F07AE572FB1",
  "this.overlay_936C7C50_853E_E813_41DD_C885BDABAB63",
  "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -58.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A0D2E2B_85C5_FDF7_41CC_4A1205985C50"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -175.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95A25E94_85C5_FAD1_41D3_F56849C7BCE5"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 122.09,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B050D40_85C5_FFB1_41DA_17F0125C4789"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -165.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8AD4B072_85C5_E651_41C7_7DA727DD1BED"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 42.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A3F2E35_85C5_FDD3_41D7_2ADA54CC0895"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 30.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_97C30FF6_85C5_FA51_41A4_4D2FD56A6E16"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -138.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A39FCD8_85C5_FE50_41DD_82A09F63D620"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -111.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_97D2BFEC_85C5_FA71_41D2_23FEC9DD3850"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -19.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_949BBF70_85C5_FA51_41CF_77243B8AFF09"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 153.5,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_95800E80_85C5_FAB1_4146_34C62F0C3E00"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -71.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94306FD8_85C5_FA51_41D8_AF4742EC6D00"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A901509_8169_D018_41B2_80398562CF8E_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -155.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A8B5DBB_85C5_FED7_41BE_24A000D1628E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 117.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B1DBD36_85C5_FFD1_41DD_8121EEBFE71A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 179.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94451FA3_85C5_FAF7_41DD_A4E0DEE00DD2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 131.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8B38FD54_85C5_FE51_41BB_C069CB315B78"
},
{
 "hfov": 360,
 "label": "005",
 "adjacentPanoramas": [
  {
   "yaw": 24.12,
   "backwardYaw": -137.79,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3",
   "distance": 1
  },
  {
   "yaw": 107.65,
   "backwardYaw": 127.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_t.jpg",
 "id": "panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_6DACAE10_7D97_89AA_41DD_4726EE09EE43",
  "this.overlay_6D4648DA_7D96_8A59_41D9_5F417D9D0E80",
  "this.overlay_A842E3CF_829F_ACC7_41DD_386B3D5FE982",
  "this.overlay_A8BC0C42_829F_FB39_41DD_BBDA1105E604",
  "this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -131.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A661E0C_85C5_FDB1_41B8_4A2BC1A9763F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": 128.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_8A495DEE_85C5_FE70_41C2_04D80332ABCB"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 110,
  "yaw": -83.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_94A47F8E_85C5_FAB1_41C5_1395E00B52E7"
},
{
 "hfov": 360,
 "label": "031",
 "adjacentPanoramas": [
  {
   "yaw": -57.91,
   "backwardYaw": 128.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8",
   "distance": 1
  },
  {
   "yaw": -105.76,
   "backwardYaw": 5.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40",
   "distance": 1
  }
 ],
 "thumbnailUrl": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_t.jpg",
 "id": "panorama_8A9680C3_8168_5008_41D7_BF610954DCBA",
 "pitch": 0,
 "hfovMin": "105%",
 "hfovMax": 110,
 "partial": false,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/f/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/f/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/u/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/u/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/r/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/r/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/b/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/b/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/d/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/d/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/l/0/{row}_{column}.jpg",
      "rowCount": 6,
      "height": 3072,
      "tags": "ondemand",
      "width": 3072,
      "colCount": 6,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/l/1/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_A62EEC71_8369_BBDB_41DD_3D172A36FDBF",
  "this.overlay_A5C47C95_8368_BB58_4149_4C3C941FFC8F",
  "this.overlay_A7301429_8368_6B4B_41D1_EF57B6DC3E40",
  "this.overlay_A7101F53_836F_F5D8_41C5_D5E58C764D90",
  "this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_tcap0"
 ]
},
{
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "paddingLeft": 0,
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "minHeight": 50,
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "minWidth": 100,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarRight": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "shadow": false,
 "progressBarBorderSize": 0,
 "height": "100%",
 "progressBarBorderRadius": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "paddingRight": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingTop": 0,
 "playbackBarHeadHeight": 15,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "class": "ViewerArea",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "data": {
  "name": "Main Viewer"
 },
 "paddingBottom": 0
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E, this.camera_95D6ECEC_85C5_FE71_41DB_898A765EF187); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_93BB9B04_81A8_7008_41D4_0B41F906CCF6",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 29.64,
   "yaw": 41.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0_HS_0_1_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.92,
   "image": "this.AnimatedImageResource_9CFDBB5E_81E8_5038_41BB_EC6D27DE4C6E",
   "pitch": -6.94,
   "yaw": 47.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_94BF311E_81A8_5039_41BE_1B6C4B943999",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.92,
   "yaw": 47.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E, this.camera_8B6DFD17_85C5_FFDF_41C0_B1057DAE22AD); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_944FF93C_81A8_F079_41C1_75B329C676DD",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0_HS_2_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0_HS_2_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0_HS_2_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_0_HS_2_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.9,
   "image": "this.AnimatedImageResource_9CFD3B5F_81E8_5038_41D8_223A6A7BC5F8",
   "pitch": -10.86,
   "yaw": -109.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_92802A89_81A8_B01B_41BC_31DF038F7634",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.9,
   "yaw": -109.66,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.86,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_1_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B, this.camera_8B38FD54_85C5_FE51_41BB_C069CB315B78); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A25A0154_8398_6DD8_41C8_F20D7EEBF891",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 56.64,
   "yaw": 107.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_0_1_0_map.gif",
      "width": 144,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.94,
   "image": "this.AnimatedImageResource_AF84C8E5_8368_5CF8_41A6_84C6DAD7C28B",
   "pitch": -10.24,
   "yaw": 107.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A3B0D180_8398_AD38_41A7_9B122ED4F83C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.94,
   "yaw": 107.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E, this.camera_8AD3BD68_85C5_FE71_41D7_FE87BA7086AB); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A23B491F_8399_FD47_41D9_6A62D4F0CF8E",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 31.48,
   "yaw": 14.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_2_1_0_map.gif",
      "width": 155,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A901509_8169_D018_41B2_80398562CF8E, this.camera_8B265D5F_85C5_FE4F_41E0_70940F4E2559); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A36A1636_8398_5758_41D7_2056F46AB954",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 50.77,
   "yaw": -41.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_3_1_0_map.gif",
      "width": 86,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.19,
   "image": "this.AnimatedImageResource_AF85C8E6_8368_5CF8_41D0_119DDD9091FD",
   "pitch": -5.05,
   "yaw": -55.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A0ADDB46_839F_BD39_41DB_8374363077AF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.19,
   "yaw": -55.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.19,
   "image": "this.AnimatedImageResource_AF8598E6_8368_5CF8_41BE_B60D93345063",
   "pitch": -5.16,
   "yaw": 12.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A30C04CF_839F_D4C8_41DA_C5F8407B21CC",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.19,
   "yaw": 12.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A97757C_8169_B0F9_41BE_F1769D222827_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_95800E80_85C5_FAB1_4146_34C62F0C3E00); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9877FC35_8299_DB58_41D5_9C90666F0445",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 38.85,
   "yaw": 160.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0_HS_0_1_0_map.gif",
      "width": 88,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.13,
   "image": "this.AnimatedImageResource_AF8CC8D1_8368_5CD8_41DF_A1BFF34F7787",
   "pitch": -13.12,
   "yaw": 159.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9EFC4778_8298_75CA_41DC_E506F6D687A8",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.13,
   "yaw": 159.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366, this.camera_97E3000A_85C5_E5B1_41D6_6AE38B5D8B7B); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_73FDFBF7_7D8F_8E57_41D5_C6644A4B3E5F",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 61.16,
   "yaw": -15.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 2.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_0_1_0_map.gif",
      "width": 147,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578, this.camera_94306FD8_85C5_FA51_41D8_AF4742EC6D00); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_734F255A_7D8E_9A59_41B7_5524BDBF6CED",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 62.54,
   "yaw": 48.11,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_1_1_0_map.gif",
      "width": 116,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE, this.camera_97C30FF6_85C5_FA51_41A4_4D2FD56A6E16); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_72EE4A79_7D8D_8E5A_41D6_407DC4DA4E56",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 30.23,
   "yaw": -62.68,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_2_1_0_map.gif",
      "width": 68,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3, this.camera_94229FE2_85C5_FA71_41C1_F61BEA4C201F); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6D896540_7D8B_FBA9_41DC_94EF3FB8C83D",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 31.22,
   "yaw": 163.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_3_1_0_map.gif",
      "width": 67,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3, this.camera_97D2BFEC_85C5_FA71_41D2_23FEC9DD3850); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6D127D82_7D8B_8AAE_41D1_B99F1905795B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 38.33,
   "yaw": -160.91,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_4_1_0_map.gif",
      "width": 81,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB, this.camera_97CCD001_85C5_E5B3_41CB_11312468AB0D); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6D3D049E_7D95_FAD6_41D9_427BB529862F",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 33.31,
   "yaw": 127.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_5_1_0_map.gif",
      "width": 99,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.4,
   "image": "this.AnimatedImageResource_AC409394_8369_AD58_41D8_EDC5520D7562",
   "pitch": -4.28,
   "yaw": 168.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9B126B25_8169_BD78_41DA_BDCD3C344C27",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.4,
   "yaw": 168.22,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_6_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.69,
   "image": "this.AnimatedImageResource_9ED9C811_8299_DB58_41B7_72AEAEB1E41A",
   "pitch": -3.27,
   "yaw": -20.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9DDDD1D9_8168_ECCB_41D3_8450457CCB9B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.69,
   "yaw": -20.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_7_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.69,
   "image": "this.AnimatedImageResource_9ED80811_8299_DB58_41E0_362E0E9AD65E",
   "pitch": -2.22,
   "yaw": -68.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9DB7FA2F_8168_FF48_41DF_FDCE022D0F4D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.69,
   "yaw": -68.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_8_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.69,
   "image": "this.AnimatedImageResource_9ED84811_8299_DB58_41A1_5435D6EFE19B",
   "pitch": -2.76,
   "yaw": 50.35,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_984C6800_8168_DB38_41D2_BC5D944268B4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.69,
   "yaw": 50.35,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_9_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.59,
   "image": "this.AnimatedImageResource_AC3F7394_8369_AD58_41DF_34025D35EF52",
   "pitch": -8.88,
   "yaw": 134.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_98317F46_8298_5538_41B5_E0541819AB8E",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.59,
   "yaw": 134.68,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_10_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212, this.camera_953E1F12_85C5_FBD0_41DE_D098548609F6); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A4F31E47_8398_B7C7_41CE_D6B704721A7C",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_0_2_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A929617_8169_B008_41D4_B1BB387D2CDD, this.camera_9528EF21_85C5_FBF0_41B4_AF5168180BB8); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A49CAC6D_8398_FBC8_41DE_058CC222A880",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 98.16,
   "yaw": -70.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_1_1_6_map.gif",
      "width": 110,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.28,
   "image": "this.AnimatedImageResource_AF7868E8_8368_5CCD_41DE_864C6E36212C",
   "pitch": 0.32,
   "yaw": 58.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A630ACE3_8399_D4FF_41D5_3124667A3C37",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.28,
   "yaw": 58.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_2_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.26,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_3_0.png",
      "width": 165,
      "class": "ImageResourceLevel",
      "height": 159
     }
    ]
   },
   "pitch": 4.08,
   "yaw": -65.57
  }
 ],
 "id": "overlay_A6CE33CD_8368_ACCB_41BD_4CB00668EA77",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.26,
   "yaw": -65.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 4.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827, this.camera_94D89F31_85C5_FBD0_41C0_56AA56103904); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_96475C48_852B_6873_41DE_7F200E8B0ED0",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 63.65,
   "yaw": -1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_4_1_6_map.gif",
      "width": 113,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.2,
   "image": "this.AnimatedImageResource_91B88A32_8526_A816_41DD_73159A1D74D8",
   "pitch": -2.92,
   "yaw": 5.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_914776F6_8525_B81F_41B8_ED60501C8558",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.2,
   "yaw": 5.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD, this.camera_9456DF99_85C5_FAD3_41C7_44028A448356); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_95E3471F_81A8_7037_41B8_5E36F72A8049",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.09,
   "yaw": 117.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_0_1_0_map.gif",
      "width": 88,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE, this.camera_948B7F7A_85C5_FA51_41CB_A8E291A7A959); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9525D475_81A8_D00B_41D1_A14EBBAFBC08",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 21.12,
   "yaw": 137.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_1_1_0_map.gif",
      "width": 65,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1, this.camera_94EB9F63_85C5_FA77_41DB_C387373D31B2); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_95EED355_81B8_B008_41DA_9F9BAC021158",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 85.8,
   "yaw": 66.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_2_1_0_map.gif",
      "width": 108,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5, this.camera_94B47F85_85C5_FAB3_41D2_906A5FEBAFB0); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_942914A0_8198_5009_41CC_697F67B0E846",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 50.16,
   "yaw": -125.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_3_1_0_map.gif",
      "width": 86,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.74,
   "image": "this.AnimatedImageResource_9CF81B69_81E8_5018_41C2_9066EB36BDAC",
   "pitch": -6.59,
   "yaw": -126.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9404F3D0_8198_5009_41BF_7C5D39B08CD2",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.74,
   "yaw": -126.11,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5, this.camera_949BBF70_85C5_FA51_41CF_77243B8AFF09); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9410D58C_819B_F019_41DA_D3E0CEE6DFE9",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.67,
   "yaw": -26.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_5_1_0_map.gif",
      "width": 42,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA, this.camera_94451FA3_85C5_FAF7_41DD_A4E0DEE00DD2); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_955BBBAD_8198_7018_41DF_AF9B7590296B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.98,
   "yaw": -13.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_6_1_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96, this.camera_94A47F8E_85C5_FAB1_41C5_1395E00B52E7); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_941E13EC_8198_D019_41AE_506D1C3B932B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.71,
   "yaw": 21.61,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_7_1_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.02,
   "image": "this.AnimatedImageResource_9DEBDD9C_8565_E813_41D1_17C7E311ABA6",
   "pitch": -0.49,
   "yaw": -14.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_97DFA2F6_81E8_B009_41DC_D12777ADF4AB",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.02,
   "yaw": -14.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_8_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.08,
   "image": "this.AnimatedImageResource_9DEBFD9C_8565_E813_41D7_24942FBE8532",
   "pitch": -0.94,
   "yaw": -25.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9721E75B_81E8_B03F_41D3_94FD3B4142E4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.08,
   "yaw": -25.03,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.94,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_9_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.48,
   "image": "this.AnimatedImageResource_9DEB9D9C_8565_E813_41C1_A622EE041DD6",
   "pitch": -3.48,
   "yaw": 21.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_973098AF_81E8_B017_41D0_8E087DC43471",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.48,
   "yaw": 21.24,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_10_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.73,
   "image": "this.AnimatedImageResource_9DEBBD9C_8565_E813_41B6_FD122C5AADF4",
   "pitch": -1.11,
   "yaw": 119.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_971C62C5_81F7_B008_41B0_BB67B8DCCEF5",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.73,
   "yaw": 119.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_11_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.94,
   "image": "this.AnimatedImageResource_9CF97B6B_81E8_5018_41DE_83FF87D45700",
   "pitch": -4.55,
   "yaw": 134.75,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_97B61CCE_81F8_7018_41DD_69D2A728C253",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.94,
   "yaw": 134.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_12_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.41,
   "image": "this.AnimatedImageResource_9CF92B6B_81E8_5018_41D1_1555CD12B7F0",
   "pitch": -30.3,
   "yaw": 57.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9703A5E4_81F8_B008_41D9_78BB2A50C87E",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.41,
   "yaw": 57.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_13_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB, this.camera_95904E73_85C5_FA57_41CA_2FFB994906C2); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_931CCA9C_81A9_D038_41D2_F4A44AFCBBC1",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 73.35,
   "yaw": -84.66,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_0_HS_0_1_0_map.gif",
      "width": 130,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.47,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_1_HS_1_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ]
   },
   "pitch": -7.73,
   "yaw": -85.04
  }
 ],
 "id": "overlay_955FDE0B_81A8_701F_41D8_B9A530AE610E",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.47,
   "yaw": -85.04,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8AA741_7D9D_87AA_41C9_7713B1EA608E_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_955CFEA8_85C5_FAF1_41DD_7ECCE6283C61); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9813D437_8298_6B58_41D3_443E8766BB88",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 36.85,
   "yaw": -83.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0_HS_0_1_0_map.gif",
      "width": 104,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.51,
   "image": "this.AnimatedImageResource_AF8C58D1_8368_5CD8_41B1_A698902074B7",
   "pitch": -4.08,
   "yaw": -85.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_993BDB77_8298_DDD8_41DE_72E805778C93",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.51,
   "yaw": -85.79,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8B144D2C_85C5_FFF1_41C7_78460B5F6784); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_928AD8D6_81A8_7008_41D0_C1FC01C4405A",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_0_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_0_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8B1DBD36_85C5_FFD1_41DD_8121EEBFE71A); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_921D394D_81A8_F01B_41DF_AC4FC07B5B14",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_1_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_1_2_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_1_3_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_8B108D21_85C5_FFF3_41B3_EAA7758BF2F7); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_97318FC9_81AB_D01B_419A_83E27656B6A4",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 53.3,
   "yaw": -4.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 2.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_0_HS_2_1_6_map.gif",
      "width": 88,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.95,
   "image": "this.AnimatedImageResource_9CFBCB66_81E8_5008_41D3_24631912E78A",
   "pitch": -0.53,
   "yaw": -172.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_95C8C8A7_81A8_B017_41A2_B04FF1B0673C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 2.95,
   "yaw": -172.25,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_1_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.44,
   "image": "this.AnimatedImageResource_9CFB6B67_81E8_5008_41D9_CFCE5768A4FF",
   "pitch": -4.43,
   "yaw": -1.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_948185A7_81A8_D008_41DF_883A5D7FA141",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.44,
   "yaw": -1.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_1_HS_4_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E, this.camera_95F7FE5F_85C5_FA4F_41B4_464BBF8D714B); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_90DAC027_8198_5017_41D5_AB58C81E27B9",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 30.89,
   "yaw": -67.83,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0_HS_0_1_0_map.gif",
      "width": 100,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.25,
   "image": "this.AnimatedImageResource_9CFF2B5D_81E8_5038_41DE_31568A9BAB58",
   "pitch": -5.71,
   "yaw": -69.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90378D00_819B_D008_41A8_81F6BFAF62D4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.25,
   "yaw": -69.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27, this.camera_95E7EE69_85C5_FA73_41DE_0659A4C7250F); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_93C33366_8198_5009_41D8_F71B9D8FC7A0",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.99,
   "yaw": 107.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_0_HS_2_1_0_map.gif",
      "width": 25,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_1_HS_3_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ]
   },
   "pitch": -7.22,
   "yaw": 106.39
  }
 ],
 "id": "overlay_93351E0B_8198_7018_41C9_CF0A448F730F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.48,
   "yaw": 106.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_8AE45D9D_85C5_FED3_41D1_9B96C6DE8AAD); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9F6DA9E2_8378_5CF9_41A0_71F619AEE844",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 33.21,
   "yaw": -68.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_0_1_0_map.gif",
      "width": 111,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.72,
   "image": "this.AnimatedImageResource_AF80A8DE_8368_5CC8_41CB_783CFA441A79",
   "pitch": -0.01,
   "yaw": -70.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9C7B3272_8378_AFD8_41DD_90D962425786",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.72,
   "yaw": -70.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711, this.camera_8AF86D91_85C5_FED3_41DC_7BBEDAFF2725); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9F46C149_8378_EDCB_41D8_E9C90E4E9907",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 16.75,
   "yaw": 122.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_2_1_0_map.gif",
      "width": 115,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_3_0.png",
      "width": 57,
      "class": "ImageResourceLevel",
      "height": 57
     }
    ]
   },
   "pitch": -0.26,
   "yaw": 122.44
  }
 ],
 "id": "overlay_9C3AF45B_8378_6BCF_41C7_E1BDE9F74528",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 2.51,
   "yaw": 122.44,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA, this.camera_8B050D40_85C5_FFB1_41DA_17F0125C4789); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A7687A95_8369_FF5B_41C7_F1899E466B9F",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_0_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_0_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 9.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_1_0.png",
      "width": 217,
      "class": "ImageResourceLevel",
      "height": 228
     }
    ]
   },
   "pitch": 17.15,
   "yaw": 124.98
  }
 ],
 "id": "overlay_A53DE1A7_8368_6D78_41D2_5FAD89CBD6EF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.12,
   "yaw": 124.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 17.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_0_HS_1_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827, this.camera_8AC16087_85C5_E6BF_41A5_A493E9C245B8); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A35B246F_8398_6BC7_41D7_9313765C8B4B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 44.11,
   "yaw": 85.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_0_1_0_map.gif",
      "width": 116,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A3034EF5_8398_54DB_41D9_D023AFEA4371",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 39.51,
   "yaw": 33.66,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_1_1_0_map.gif",
      "width": 131,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.21,
   "image": "this.AnimatedImageResource_AF7AB8E7_8368_5CF8_41DA_616748ACFF21",
   "pitch": -4.99,
   "yaw": 94.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A07B8D05_8398_553B_41A7_0022391C95B0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.21,
   "yaw": 94.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.26,
   "image": "this.AnimatedImageResource_AF7B68E7_8368_5CF8_41CF_7D567AA003A6",
   "pitch": -3.59,
   "yaw": 33.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A013F935_8398_5D5B_41DD_C1A97045E371",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.26,
   "yaw": 33.66,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A901509_8169_D018_41B2_80398562CF8E_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8A910DA8_85C5_FEF1_41C5_8B3117CC8FBA); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_72EADB23_7D95_8FEE_41C9_8B758F5D2161",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 75.84,
   "yaw": 68.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_0_1_0_map.gif",
      "width": 121,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB, this.camera_8A9D0DB2_85C5_FED1_41D9_D45761ED5D8C); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7256A1A9_7D95_9AFA_41B5_8E9F2B5D84C9",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_1_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_1_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_1_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_1_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB, this.camera_8A8B5DBB_85C5_FED7_41BE_24A000D1628E); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_722DF1FE_7D96_FA56_41D3_7404D9782CAE",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_2_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_2_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_2_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_2_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C, this.camera_8AB67DC5_85C5_FEB0_41D7_4175F9D4B883); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8CE6A942_8178_D008_41DC_1D830ACBFF83",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 34.01,
   "yaw": 4.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_3_1_6_map.gif",
      "width": 116,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.51,
   "image": "this.AnimatedImageResource_9C828B50_81E8_5009_41DB_69E3B9E3D2D6",
   "pitch": -1.44,
   "yaw": 2.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8F79E4D7_8178_5037_41DF_81CB9EECA832",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.51,
   "yaw": 2.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_1_HS_4_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.77,
   "image": "this.AnimatedImageResource_B2451746_8298_B539_41C8_88A008BF17AD",
   "pitch": 3.46,
   "yaw": 172.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AC264486_8299_EB38_41BC_E027A2ED9A9D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.77,
   "yaw": 172.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_5_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.75,
   "image": "this.AnimatedImageResource_8B8635EE_8527_F80F_41D5_B9AACF02DBCE",
   "pitch": -6.79,
   "yaw": 90.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AE370B8A_8298_5D48_41C9_7FE690649B7C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.75,
   "yaw": 90.11,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_6_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD, this.camera_8A0C9CCE_85C5_FEB0_419A_8A68BB954D6B); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8EDA470B_8168_D018_41D3_C9E990B37632",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 62.13,
   "yaw": 89.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0_HS_0_1_0_map.gif",
      "width": 92,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C, this.camera_8A257CE3_85C5_FE70_41C0_EA2B1B66B715); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_914464C8_8168_5018_41BC_D37B7DAB459D",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 30.65,
   "yaw": -12.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0_HS_1_1_0_map.gif",
      "width": 108,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.24,
   "image": "this.AnimatedImageResource_9C811B5B_81E8_5038_41B4_9C3BAC5FC00D",
   "pitch": 6.47,
   "yaw": 87.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90D3094C_8169_B018_41D8_43241B441DBE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.24,
   "yaw": 87.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 6.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.77,
   "image": "this.AnimatedImageResource_9CFEBB5C_81E8_5038_4145_E81FC85B0D64",
   "pitch": -0.31,
   "yaw": -16.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9190587D_8169_F0F8_41C7_FB21A93AF16D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.77,
   "yaw": -16.58,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB, this.camera_8A39FCD8_85C5_FE50_41DD_82A09F63D620); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_936BA722_8168_B009_41C1_02E08FB9DF8A",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 16.98,
   "yaw": -115.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0_HS_4_1_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.45,
   "image": "this.AnimatedImageResource_9CFE1B5C_81E8_5038_41BF_80DC3A24990A",
   "pitch": 1.35,
   "yaw": -96.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_905D113A_8168_B079_41CF_6393080F4C02",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.45,
   "yaw": -96.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_903829EA_8198_B019_41DA_CB0B06B28176",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 26.88,
   "yaw": -93.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_0_HS_6_1_0_map.gif",
      "width": 88,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.45,
   "image": "this.AnimatedImageResource_9CFF9B5D_81E8_5038_41C3_ADEB48919AF0",
   "pitch": 1.35,
   "yaw": -113.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90462230_8199_D009_41CF_0C0A4A523C5F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.45,
   "yaw": -113.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_7_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_8ADF007D_85C5_E653_419C_07D157A55B06); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_989B22BA_8298_AF48_41DC_518D45DC65E2",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 72.44,
   "yaw": -0.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_0_1_0_map.gif",
      "width": 100,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.98,
   "image": "this.AnimatedImageResource_AF8D48D7_8368_5CD8_419A_6FE6DEFFECD7",
   "pitch": 6.97,
   "yaw": -0.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9F4329EF_829B_FCC8_41C2_BF1720CB068A",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.98,
   "yaw": -0.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 6.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689, this.camera_8AD3C06A_85C5_E670_41CC_C89EF0474AE1); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_99980071_8298_ABD8_41A4_899BAED7C851",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 42.3,
   "yaw": -62.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_2_1_0_map.gif",
      "width": 87,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_3_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ]
   },
   "pitch": -3.2,
   "yaw": -58.41
  }
 ],
 "id": "overlay_9E475680_8299_B738_41B3_9F03063F50B2",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.52,
   "yaw": -58.41,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743, this.camera_8AD4B072_85C5_E651_41C7_7DA727DD1BED); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9EB3516A_82E9_ADC9_41DC_7116D5919D22",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 91,
   "yaw": -143.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_4_1_0_map.gif",
      "width": 113,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.86,
   "image": "this.AnimatedImageResource_AF8258D8_8368_5CC8_41BB_CAA274B36A30",
   "pitch": -17.88,
   "yaw": -164.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9E2C455A_82E8_D5C9_4198_0E856C091C19",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.86,
   "yaw": -164.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD, this.camera_954CDEBB_85C5_FAD7_41CB_95601E4DAE91); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9E0C0726_837B_B579_41D8_CDBE61B5637B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 57.59,
   "yaw": -8.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0_HS_0_1_0_map.gif",
      "width": 106,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0_HS_1_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ]
   },
   "pitch": -2.7,
   "yaw": -10.43
  }
 ],
 "id": "overlay_9F3BB4DB_8378_D4C8_41D7_D989A9A009F7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.53,
   "yaw": -10.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A9B6632_8168_B009_41D5_7A5AFAED0711_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8A661E0C_85C5_FDB1_41B8_4A2BC1A9763F); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_70779DD7_7D8E_8A57_41B0_7BAE180998F7",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 113.33,
   "yaw": 108.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 135
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366, this.camera_8A7B4DF8_85C5_FE50_41CB_E909F3BC9F4B); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_734E0099_7D8E_BADB_41D8_0D3B7BBFB44D",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 109.12,
   "yaw": -137.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_1_1_0_map.gif",
      "width": 122,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.39,
   "image": "this.AnimatedImageResource_AFCE9653_8369_D7D8_41DF_A43CD9D42FEF",
   "pitch": -9.57,
   "yaw": 110.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A927C895_8368_DB58_41CD_60103D37B01D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.39,
   "yaw": 110.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.81,
   "image": "this.AnimatedImageResource_AFCEA653_8369_D7D8_41AC_FEE066200BA4",
   "pitch": -2.78,
   "yaw": -147.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AEA7B472_8368_6BD8_4181_6A85637724DE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.81,
   "yaw": -147.84,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA, this.camera_957D5ECC_85C5_FAB1_41D3_24F5EB38B14A); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_99330E57_8297_B7C7_41BF_3EA84A30FFBD",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 64.44,
   "yaw": 14.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0_HS_0_1_0_map.gif",
      "width": 104,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.88,
   "image": "this.AnimatedImageResource_AF82B8D8_8368_5CC8_41C5_9C7C781B15AA",
   "pitch": -6.54,
   "yaw": 20.05,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9E7232E5_8298_ECFB_41BE_636A4F759F3A",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.88,
   "yaw": 20.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_94001FCE_85C5_FAB1_41CA_B94491A8A8D2); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9E589833_8298_DB5F_41D9_A4E820BF786A",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 45.77,
   "yaw": 96.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0_HS_0_1_0_map.gif",
      "width": 107,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.51,
   "image": "this.AnimatedImageResource_AF83A8D9_8368_5CC8_41A6_56DD9D03113C",
   "pitch": 3.33,
   "yaw": 99.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9F695323_8378_ED78_41D9_8991C5AC747C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.51,
   "yaw": 99.61,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E, this.camera_8AACBDDA_85C5_FE50_41C5_6A81D38B4B06); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A156154E_8397_D5C8_41B0_519251D0FB8B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.31,
   "yaw": 25.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0_HS_0_1_0_map.gif",
      "width": 54,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0_HS_1_0.png",
      "width": 87,
      "class": "ImageResourceLevel",
      "height": 110
     }
    ]
   },
   "pitch": -7.06,
   "yaw": 27.17
  }
 ],
 "id": "overlay_A74FB73B_8397_B548_41D3_4689E9146717",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.82,
   "yaw": 27.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 20
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A929617_8169_B008_41D4_B1BB387D2CDD_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E, this.camera_956D5EDC_85C5_FA51_41C6_933B198011A5); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A18E4B52_8398_5DD8_41D2_6D7F6B94C3F2",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 27.93,
   "yaw": -122.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0_HS_0_1_0_map.gif",
      "width": 62,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.98,
   "image": "this.AnimatedImageResource_AF78B8ED_8368_5CC8_41D5_0AA526F2D399",
   "pitch": -7.27,
   "yaw": -121.72,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A762ECCD_8398_D4C8_41D0_58F778070AE9",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.98,
   "yaw": -121.72,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40, this.camera_8B21904B_85C5_E5B0_41C0_470462E08F8C); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A9A6C756_8379_B5D9_41BE_FF4313A91737",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_0_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_0_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40, this.camera_8B25D055_85C5_E650_41DD_8F3B66291CF1); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AEB97B5C_8379_DDC8_41D8_729D933E4FF2",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_1_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_1_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_1_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_1_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 8.4,
   "image": "this.AnimatedImageResource_AF7D18F5_8368_5CD8_41D7_0583ECC16B30",
   "pitch": 17.02,
   "yaw": 167.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AA79EACD_8378_DCCB_41CF_A9F98C5B9BA0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.4,
   "yaw": 167.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 17.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_2_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4, this.camera_8B298060_85C5_E670_41DB_99DCABACF1E0); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AB8F44ED_8378_B4C8_41C4_48EC4518BE10",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 56.43,
   "yaw": 0.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_3_1_6_map.gif",
      "width": 76,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.3,
   "image": "this.AnimatedImageResource_AF7D88F5_8368_5CD8_41C7_6AE631A77522",
   "pitch": -0.62,
   "yaw": -5.85,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AA94F67E_837B_D7C8_41CB_91EEF5C51A20",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 2.3,
   "yaw": -5.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_4_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA, this.camera_8AF3CD86_85C5_FEB1_41A0_F155C7668829); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_99887AF1_8299_BCDB_41C2_0A168547820F",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_0_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_0_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 8.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_1_0.png",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 188
     }
    ]
   },
   "pitch": -1.82,
   "yaw": 103
  }
 ],
 "id": "overlay_9C6BBFE1_8299_D4F8_41DC_84DBD5AFBFE6",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.79,
   "yaw": 103,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_0_HS_1_0_6_map.gif",
      "width": 17,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_6D8DCC61_7D9E_8A6B_41AB_B2377B4FF689_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1, this.camera_8A11CE16_85C5_FDD1_41C2_38A9904E277C); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9C71E56F_83F9_F5C8_41AA_A6227F7C30FA",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 35.97,
   "yaw": -15.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_0_1_0_map.gif",
      "width": 77,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 01a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 8.13,
   "image": "this.AnimatedImageResource_AF8688DF_8368_5CC8_41DC_2CF755BC15BB",
   "pitch": -5.31,
   "yaw": -8.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A2BFF925_8399_DD78_41D5_D3D42B58F5A1",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.13,
   "yaw": -8.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_1_0_0_map.gif",
      "width": 22,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A97757C_8169_B0F9_41BE_F1769D222827, this.camera_8A024E21_85C5_FDF3_41B7_39373C62579F); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A3B2BF1C_8398_7548_41CE_D501E06125F9",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 34.22,
   "yaw": -48.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_2_1_0_map.gif",
      "width": 89,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40, this.camera_8A0D2E2B_85C5_FDF7_41CC_4A1205985C50); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9D74F549_8398_D5C8_41C6_0FBD289B8F43",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 18.57,
   "yaw": 29.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_3_1_0_map.gif",
      "width": 41,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.25,
   "image": "this.AnimatedImageResource_AF8788E0_8368_5CF8_41C0_E148A839E0EB",
   "pitch": -5.46,
   "yaw": -46.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A3D5E468_8398_ABC8_41C0_2A224F0AC887",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.25,
   "yaw": -46.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.68,
   "image": "this.AnimatedImageResource_AF8458E0_8368_5CF8_41D1_DFA26A764819",
   "pitch": -6.06,
   "yaw": 33.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A0C62A7B_8398_FFC8_41DB_A3BD3106F5EC",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.68,
   "yaw": 33.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD, this.camera_8B33CD4A_85C5_FFB1_41C9_5F6EA95B7237); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_90195315_8198_F008_419B_4983981E5263",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 47,
   "yaw": -140.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_0_HS_0_1_0_map.gif",
      "width": 62,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_1_HS_1_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ]
   },
   "pitch": -2.45,
   "yaw": -137.29
  }
 ],
 "id": "overlay_93B9F8AE_8198_7019_41C3_9383BC07FB3B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.53,
   "yaw": -137.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_771DBC9A_7D7A_8AD9_41BA_57E02A725A27_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771F0294_7D7A_BEA9_4184_B29C074C4714, this.camera_95524E9E_85C5_FAD1_41B7_D2D6879DE77B); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8E7929FB_8178_B3F8_41C0_6CB814FED217",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_0_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.68,
   "image": "this.AnimatedImageResource_9C834B53_81E8_500F_41C2_5F1DD18C33A4",
   "pitch": -5.68,
   "yaw": -87.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8E9DF0DB_8178_503F_41B9_B632C715B6F4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.68,
   "yaw": -87.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_1_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3, this.camera_95A25E94_85C5_FAD1_41D3_F56849C7BCE5); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8E42623B_817F_D07F_41DE_B5E093AF9FAE",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_2_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_2_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_2_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_2_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.52,
   "image": "this.AnimatedImageResource_9C80EB59_81E8_5038_41D4_8A65B14495EA",
   "pitch": 3.2,
   "yaw": 117.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_913E0BEC_8169_F018_41C4_02AE0F144989",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.52,
   "yaw": 117.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E, this.camera_95B2BE8B_85C5_FAB7_4191_2FA2F31D5C31); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8EBA62C6_8168_D009_41DF_966BD4F3FD6B",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.69,
   "yaw": 43.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_0_HS_4_1_6_map.gif",
      "width": 99,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.22,
   "image": "this.AnimatedImageResource_9C805B5A_81E8_5038_41B9_72A5E6BB7C3A",
   "pitch": -4.68,
   "yaw": 43.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_91CBB708_8168_5018_41E0_188511617BB9",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.22,
   "yaw": 43.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_5_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F, this.camera_94F91F53_85C5_FA57_41D9_164B5EE8D571); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9F98E9C6_8378_BD38_41D6_B8050DDA1760",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 75.25,
   "yaw": -37.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_0_1_0_map.gif",
      "width": 140,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Arrow 02 Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 10.03,
   "image": "this.AnimatedImageResource_AF81B8DF_8368_5CC8_41C4_BFF3AD8F72C4",
   "pitch": -33.73,
   "yaw": -44.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_9CDA49BF_837B_BD48_41C3_FA9C7E1899B5",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.03,
   "yaw": -44.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B, this.camera_94C95F40_85C5_FBB0_41B4_3FC76A40BD59); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A2233554_8378_D5D8_41AD_161491A09A04",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 55.17,
   "yaw": 8.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_2_1_0_map.gif",
      "width": 159,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 02c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 10,
   "image": "this.AnimatedImageResource_AF8618DF_8368_5CC8_41A9_7F8C71F608F6",
   "pitch": -47.04,
   "yaw": 9.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9DEB64E5_83F8_54F8_41D0_3B6B1019858B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10,
   "yaw": 9.22,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -47.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_3_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4, this.camera_8A5EEDE4_85C5_FE70_41B5_E6D4DA0DAA0D); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA7F4DBF_8378_D548_41BF_6291CD6F97DE",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_0_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_0_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9651C3_8168_B008_41D1_35265ABE32B4, this.camera_8A495DEE_85C5_FE70_41C2_04D80332ABCB); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA2B0335_8378_AD58_41DD_5FE2F4C8E887",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_1_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_1_2_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_1_3_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.53,
   "image": "this.AnimatedImageResource_AF72C8FC_8368_5CC8_41AC_2833828A2A20",
   "pitch": 0.82,
   "yaw": -135.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AF1EEDD5_8378_D4D8_41C7_E46A310DE7CE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.53,
   "yaw": -135.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_2_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A909718_8168_5039_41D3_6144A42FFF11_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77253312_7D7B_FFAE_41B1_09F420FC7578, this.camera_8A3F2E35_85C5_FDD3_41D7_2ADA54CC0895); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_700C1DF2_7D8B_8A69_41D4_8F7D589C41A0",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 56.85,
   "yaw": -66.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_0_1_0_map.gif",
      "width": 129,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8A2B9E41_85C5_FDB3_41D3_5E2EEED53000); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_711CCE18_7D8B_89DA_41D5_8B8B2B2F070F",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 64.7,
   "yaw": -3.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_1_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 196
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.67,
   "image": "this.AnimatedImageResource_AFCF9652_8369_D7D8_41C1_1EFF31866E7F",
   "pitch": -4.95,
   "yaw": -66.62,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A94A7237_8368_6F47_41B0_49DFF5AC8AE7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 2.67,
   "yaw": -66.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.66,
   "image": "this.AnimatedImageResource_AFCFF652_8369_D7D8_41DE_D211BF4A9540",
   "pitch": -6.46,
   "yaw": -0.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A91148AC_8368_5B49_41D6_70026EEB6520",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 2.66,
   "yaw": -0.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570, this.camera_951E0EED_85C5_FA70_41CC_6611D432706F); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A585B6A4_8378_5778_41DD_AB165E612C94",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_0_1_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_0_2_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_0_3_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A909718_8168_5039_41D3_6144A42FFF11, this.camera_950E2F02_85C5_FBB0_41E0_40B8E1F3320A); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AAFBC23E_8378_6F49_41D1_CDB01D7FF780",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 57.9,
   "yaw": -51.25,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_1_1_6_map.gif",
      "width": 89,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.71,
   "image": "this.AnimatedImageResource_AF7378F6_8368_5CD8_41E0_1AEC7D9A3855",
   "pitch": -1.95,
   "yaw": -103.7,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AE9A82D4_8378_ACD8_41DE_50B83D2A1591",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.71,
   "yaw": -103.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_2_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.02,
   "image": "this.AnimatedImageResource_AF7348F6_8368_5CC5_41CE_5703BF2CBFE9",
   "pitch": 1.19,
   "yaw": -52.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AB4B788B_8378_5B48_41D2_1010B84B9482",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.02,
   "yaw": -52.32,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_77125FF3_7D7A_866E_41D3_CE47580C665C, this.camera_8AA03DCF_85C5_FEB0_418F_50CB70136297); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8E20AC5D_8179_F038_41CE_76C7B76D7946",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0_HS_0_2_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.18,
   "image": "this.AnimatedImageResource_9C81DB5A_81E8_5038_41DF_A4F3D1087F5D",
   "pitch": -5.92,
   "yaw": 63.33,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8ECC1148_8177_B019_41C2_5958D7F64A0D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 4.18,
   "yaw": 63.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_1_HS_1_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A926437_8168_F008_41D2_D6CCDFAF0570, this.camera_94775FAD_85C5_FAF3_41D4_70B3141B7889); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A65D2455_836B_EBD8_41D7_79C0451C5FE7",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 34.57,
   "yaw": -36.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_0_1_0_map.gif",
      "width": 77,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9680C3_8168_5008_41D7_BF610954DCBA, this.camera_94179FC2_85C5_FAB1_41DE_E68C0F64D03B); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A7EC9E24_836B_B745_41DB_96CC40F1AA43",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 43.01,
   "yaw": 5.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_1_1_0_map.gif",
      "width": 122,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.16,
   "image": "this.AnimatedImageResource_AF7E18EE_8368_5CC8_41BD_A690B896FF21",
   "pitch": -2.5,
   "yaw": 7.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A7D3D2C2_8368_AF38_41DB_798703D28E1D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.16,
   "yaw": 7.84,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.16,
   "image": "this.AnimatedImageResource_AF7EE8EE_8368_5CC8_41CC_6E618C5D49E7",
   "pitch": -1.61,
   "yaw": -36.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A773A85E_8368_FBC8_41BF_81C030FE0434",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.16,
   "yaw": -36.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B, this.camera_94674FB8_85C5_FAD1_41C9_35A7E6F213DD); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_902C1156_853F_B81E_41D4_0F07AE572FB1",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_4_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_4_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_4_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_4_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle 03c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.19,
   "image": "this.AnimatedImageResource_92733857_853D_A81D_41C4_CE5CB66C566A",
   "pitch": -10.24,
   "yaw": 166.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_936C7C50_853E_E813_41DD_C885BDABAB63",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.19,
   "yaw": 166.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_5_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3, this.camera_8AD94D73_85C5_FE57_41AE_C6E47D91DDAB); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6DACAE10_7D97_89AA_41DD_4726EE09EE43",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_0_2_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26, this.camera_8AC6AD7D_85C5_FE53_41D4_184268F6AB57); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6D4648DA_7D96_8A59_41D9_5F417D9D0E80",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 78.72,
   "yaw": 107.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_1_1_6_map.gif",
      "width": 158,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.14,
   "image": "this.AnimatedImageResource_B244D747_8298_B5C7_41D6_BD57D6C70CC8",
   "pitch": -12.82,
   "yaw": 114.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A842E3CF_829F_ACC7_41DD_386B3D5FE982",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.14,
   "yaw": 114.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.52,
   "image": "this.AnimatedImageResource_B2442747_8298_B5C7_41B1_CA56781955F9",
   "pitch": -17.62,
   "yaw": 45.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A8BC0C42_829F_FB39_41DD_BBDA1105E604",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 3.52,
   "yaw": 45.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40, this.camera_95C62E55_85C5_FA53_41DC_2108E6E76A29); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A62EEC71_8369_BBDB_41DD_3D172A36FDBF",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_0_1_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_0_2_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  },
  {
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_0_3_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.51,
   "image": "this.AnimatedImageResource_AF7F38EE_8368_5CC8_41C3_538EE6291B3B",
   "pitch": 9.85,
   "yaw": -104.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A5C47C95_8368_BB58_4149_4C3C941FFC8F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.51,
   "yaw": -104.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 9.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_1_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A91EC1B_8168_B038_41D1_D09E94B250D8, this.camera_95D45E4A_85C5_FDB1_41CD_08F3348750AE); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A7301429_8368_6B4B_41D1_EF57B6DC3E40",
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 27.54,
   "yaw": -57.91,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_2_1_6_map.gif",
      "width": 65,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_3_0.png",
      "width": 119,
      "class": "ImageResourceLevel",
      "height": 130
     }
    ]
   },
   "pitch": 7.2,
   "yaw": -56.05
  }
 ],
 "id": "overlay_A7101F53_836F_F5D8_41C5_D5E58C764D90",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.21,
   "yaw": -56.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 7.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 17
     }
    ]
   }
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_tcap0.png",
    "width": 500,
    "class": "ImageResourceLevel",
    "height": 500
   }
  ]
 },
 "hfov": 30,
 "id": "panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_tcap0",
 "distance": 50,
 "class": "TripodCapPanoramaOverlay",
 "inertia": false
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFDBB5E_81E8_5038_41BB_EC6D27DE4C6E",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_1_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFD3B5F_81E8_5038_41D8_223A6A7BC5F8",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6DF7E5A1_7D9A_9AEB_41C0_E676D84B15CB_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF84C8E5_8368_5CF8_41A6_84C6DAD7C28B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF85C8E6_8368_5CF8_41D0_119DDD9091FD",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_4_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8598E6_8368_5CF8_41BE_B60D93345063",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A97757C_8169_B0F9_41BE_F1769D222827_0_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8CC8D1_8368_5CD8_41DF_A1BFF34F7787",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D88D39B_7D9D_9EDF_41D5_F4BDABC5B7E5_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AC409394_8369_AD58_41D8_EDC5520D7562",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_6_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9ED9C811_8299_DB58_41B7_72AEAEB1E41A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_7_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9ED80811_8299_DB58_41E0_362E0E9AD65E",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_8_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9ED84811_8299_DB58_41A1_5435D6EFE19B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_9_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AC3F7394_8369_AD58_41DF_34025D35EF52",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_7712E5CF_7D7B_9AB6_41DC_129D11C5DA26_0_HS_10_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7868E8_8368_5CCD_41DE_864C6E36212C",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_91B88A32_8526_A816_41DD_73159A1D74D8",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6F34F7_8169_F1F7_41B4_C06E75D9A18E_0_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CF81B69_81E8_5018_41C2_9066EB36BDAC",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9DEBDD9C_8565_E813_41D1_17C7E311ABA6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_8_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9DEBFD9C_8565_E813_41D7_24942FBE8532",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_9_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9DEB9D9C_8565_E813_41C1_A622EE041DD6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_10_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9DEBBD9C_8565_E813_41B6_FD122C5AADF4",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_0_HS_11_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CF97B6B_81E8_5018_41DE_83FF87D45700",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_12_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CF92B6B_81E8_5018_41D1_1555CD12B7F0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8DCE7D_7D9D_865B_41DE_3A84DA65C26F_1_HS_13_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8C58D1_8368_5CD8_41B1_A698902074B7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D86B1B9_7D9D_FADB_41D7_7D2212C6DBE5_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFBCB66_81E8_5008_41D3_24631912E78A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_1_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFB6B67_81E8_5008_41D9_CFCE5768A4FF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8399A4_7D9D_8AEA_41D8_AF5248DF7DCE_1_HS_4_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFF2B5D_81E8_5038_41DE_31568A9BAB58",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771A99F2_7D7A_8A6E_41D5_CA01D3C1F6AD_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF80A8DE_8368_5CC8_41CB_783CFA441A79",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6D668F_8168_5018_41DA_D53E80E7CFDD_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7AB8E7_8368_5CF8_41DA_616748ACFF21",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7B68E7_8368_5CF8_41CF_7D567AA003A6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A901509_8169_D018_41B2_80398562CF8E_0_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C828B50_81E8_5009_41DB_69E3B9E3D2D6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_1_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B2451746_8298_B539_41C8_88A008BF17AD",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_5_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B8635EE_8527_F80F_41D5_B9AACF02DBCE",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771019F9_7D7B_8A5A_41B0_E9401BD812C3_0_HS_6_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C811B5B_81E8_5038_41B4_9C3BAC5FC00D",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFEBB5C_81E8_5038_4145_E81FC85B0D64",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFE1B5C_81E8_5038_41BF_80DC3A24990A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9CFF9B5D_81E8_5038_41C3_ADEB48919AF0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771F378C_7D7A_86B9_41D0_DE3989B1B88E_1_HS_7_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8D48D7_8368_5CD8_419A_6FE6DEFFECD7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8258D8_8368_5CC8_41BB_CAA274B36A30",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8FD60B_7D9D_B9BF_41CB_038D0A2333CA_0_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AFCE9653_8369_D7D8_41DF_A43CD9D42FEF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AFCEA653_8369_D7D8_41AC_FEE066200BA4",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77253312_7D7B_FFAE_41B1_09F420FC7578_0_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF82B8D8_8368_5CC8_41C5_9C7C781B15AA",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6D8D58F1_7D9D_8A6B_41C6_B1FB4C13D743_0_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF83A8D9_8368_5CC8_41A6_56DD9D03113C",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A95C50B_8168_D01F_41DF_0D5A9E57CF96_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF78B8ED_8368_5CC8_41D5_0AA526F2D399",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A90B57A_8169_D0F9_419E_F42F8CAD2212_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7D18F5_8368_5CD8_41D7_0583ECC16B30",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7D88F5_8368_5CD8_41C7_6AE631A77522",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A926437_8168_F008_41D2_D6CCDFAF0570_0_HS_4_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 21,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8688DF_8368_5CC8_41DC_2CF755BC15BB",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 510
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8788E0_8368_5CF8_41C0_E148A839E0EB",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8458E0_8368_5CF8_41D1_DFA26A764819",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9155ED_8168_5018_41C0_5CF33CCF1D9B_0_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C834B53_81E8_500F_41C2_5F1DD18C33A4",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C80EB59_81E8_5038_41D4_8A65B14495EA",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C805B5A_81E8_5038_41B9_72A5E6BB7C3A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77125FF3_7D7A_866E_41D3_CE47580C665C_1_HS_5_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF81B8DF_8368_5CC8_41C4_BFF3AD8F72C4",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_1_0.png",
   "width": 380,
   "class": "ImageResourceLevel",
   "height": 570
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 21,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF8618DF_8368_5CC8_41A9_7F8C71F608F6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6CF678_8168_70F8_41D3_1FCEA9EB81E1_0_HS_3_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF72C8FC_8368_5CC8_41AC_2833828A2A20",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A909718_8168_5039_41D3_6144A42FFF11_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AFCF9652_8369_D7D8_41C1_1EFF31866E7F",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AFCFF652_8369_D7D8_41DE_D211BF4A9540",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_76AA40EC_7D7B_BA7A_41BB_A2A47A9F9366_0_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7378F6_8368_5CD8_41E0_1AEC7D9A3855",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7348F6_8368_5CC5_41CE_5703BF2CBFE9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9651C3_8168_B008_41D1_35265ABE32B4_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9C81DB5A_81E8_5038_41DF_A4F3D1087F5D",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_771F0294_7D7A_BEA9_4184_B29C074C4714_1_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7E18EE_8368_5CC8_41BD_A690B896FF21",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7EE8EE_8368_5CC8_41CC_6E618C5D49E7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 22,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_92733857_853D_A81D_41C4_CE5CB66C566A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D6C2680_8168_5008_41A8_B0DC56E60D40_0_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B244D747_8298_B5C7_41D6_BD57D6C70CC8",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B2442747_8298_B5C7_41B1_CA56781955F9",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_77105D8D_7D7B_8ABA_41C9_1DDCEF7F45AB_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_AF7F38EE_8368_5CC8_41C3_538EE6291B3B",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A9680C3_8168_5008_41D7_BF610954DCBA_0_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
}],
 "width": "100%",
 "overflow": "visible"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
