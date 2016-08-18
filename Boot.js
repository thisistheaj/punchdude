/**
 * Created by ajbeckner on 8/18/16.
 */
var SpriteAnim = {};
SpriteAnim.Boot = function () {};

SpriteAnim.Boot.prototype = {
    preload: function() {
        this.load.path = 'assets/';
        this.load.image('preloaderBg', 'loading-bg.png');
        this.load.image('preloaderBar', 'loading-bar.png');
    },
    create: function() {
        this.state.start('SpriteAnim.Preloader');
    }
};