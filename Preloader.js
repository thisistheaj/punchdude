/**
 * Created by ajbeckner on 8/18/16.
 */
SpriteAnim.Preloader = function () {
};

SpriteAnim.Preloader.prototype = {

    init: function () {
        this.scale.pageAlignHorizontally = true;
    },
    
    preload: function () {
        this.load.path = 'assets/';

        //Create Loading Bar
        this.preloadBg = this.add.sprite((920-297)/2, (760-145)/2, 'preloaderBg');
        this.preloadBar = this.add.sprite((920-158)/2, (760-50)/2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);

        //SPRITES
        // this.load.spritesheet('guywalking', 'guywalking.png', 13, 14);
        this.load.spritesheet('sprites', 'sprites.png', 16, 16);
        this.load.spritesheet('myButton','number-buttons-90x90.png',90,90);

        //Level Tilemap
        this.load.tilemap('tilemap', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'TileKit.png');

        //IMAGES
        this.load.image('logo', 'logo.png');

        //FONTS
        this.load.bitmapFont('fat-and-tiny');
        this.load.bitmapFont('interfont');
    },

    create: function () {
        this.state.start('SpriteAnim.MainMenu');

    }

};
