// var SpriteAnim = {
//    
// };

// SpriteAnim.Boot = function () {
// };
//
// SpriteAnim.Boot.prototype = {
//     preload: function() {
//         this.load.path = 'assets/';
// 		this.load.image('preloaderBg', 'loading-bg.png');
// 		this.load.image('preloaderBar', 'loading-bar.png');
// 	},
// 	create: function() {
// 		this.state.start('SpriteAnim.Preloader');
// 	}
//
// };

SpriteAnim.Preloader = function () {
};

SpriteAnim.Preloader.prototype = {

    init: function () {

        this.scale.pageAlignHorizontally = true;

    },

    preload: function () {

        this.load.path = 'assets/';

        this.preloadBg = this.add.sprite((920-297)/2, (760-145)/2, 'preloaderBg');
		this.preloadBar = this.add.sprite((920-158)/2, (760-50)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('guywalking', 'guywalking.png', 13, 14);
        
        this.load.tilemap('tilemap', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'TileKit.png');
        
        this.load.image('logo', 'logo.png');
        
        this.load.bitmapFont('fat-and-tiny');
        this.load.bitmapFont('interfont');
        this.load.spritesheet('myButton','number-buttons-90x90.png',90,90);
    },

    create: function () {
        this.state.start('SpriteAnim.MainMenu');

    }

};

SpriteAnim.MainMenu = function () {
};

SpriteAnim.MainMenu.prototype = {

    create: function () {

        this.stage.backgroundColor = 0x6699FF;

        var logo = this.add.image(this.world.centerX, 50, 'logo');
        logo.anchor.x = 0.5;

        var startText = this.add.bitmapText(this.world.centerX, 600, 'fat-and-tiny', 'CLICK ANYWHERE TO PLAY', 64);
        startText.anchor.x = 0.5;
        startText.smoothed = false;
        startText.tint = 0x33ff00;

        var gameEndText = this.add.bitmapText(this.world.centerX, 200, 'interfont', ' Welcome t0 the W0rld 0f \n PUNCH DUDE! Use the \n arr0w keys t0 get 0ur \n her0 t0 the g0al, while \n av0iding Baddies. \n Use "x" t0 fight back. \n Punch, Punch. PUNCH!', 40);
        gameEndText.anchor.x = 0.5;
        gameEndText.smoothed = false;
        gameEndText.tint = 0x222222;

        this.input.onDown.addOnce(this.start, this);

    },

    start: function () {

        this.state.start('SpriteAnim.Game');

    }

};

SpriteAnim.Game = function () {

    // this.mysprite = null;

};

SpriteAnim.Game.prototype = {

    init: function () {

    },

    create: function () {


        //Start the Arcade Physics systems
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //Change the background colour
        this.stage.backgroundColor = "#6699ff";

        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        this.map = this.add.tilemap('tilemap');
        this.map.addTilesetImage('TileKit', 'tiles');

        //Add both the background and ground layers. We won't be doing anything with the
        //GroundLayer though
        // this.backgroundlayer = this.map.createLayer('Background');
        this.cloudslayer = this.map.createLayer('Clouds');
        this.groundLayerBG = this.map.createLayer('GroundLayerBG');
        this.grasstips = this.map.createLayer('GrassTips');
        this.foliage = this.map.createLayer('Foliage');
        this.groundLayer = this.map.createLayer('GroundLayer');

        //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 100, true, 'GroundLayer');

        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();

        ////////////////////////////

        this.sprite = this.add.sprite(50, 960, 'guywalking');
        this.physics.arcade.enable(this.sprite);

        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();

        //Set some physics on the sprite
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 2000;
        // this.sprite.body.gravity.x = 20;
        // this.sprite.body.velocity.x = 100;

        this.sprite.animations.add('left', [0, 1, 2], 10, true);
        this.sprite.animations.add('right', [3, 4, 5], 10, true);
        // this.sprite.animations.play('left');
        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;
        //Make the camera follow the sprite
        this.camera.follow(this.sprite);

        //Enable cursor keys so we can create some controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.winButton = this.add.button(10,this.world.height - 100,'myButton',this.displayWinText,this,1,0,2);
        this.loseButton = this.add.button(960 - 100,this.world.height - 100,'myButton',this.displayLoseText,this,4,3,5);

    },
    update: function () {

        if(this.gameEndText){
            this.gameEndText.x = this.camera.x + this.camera.width/2;
            this.gameEndText.y = this.camera.y +this.camera.height/2
        }

        if (this.startText){
            this.startText.x = this.camera.x + this.camera.width/2;
            this.startText.y = this.camera.y + this.camera.height*3/4;
        }

        //Make the sprite collide with the ground layer
        this.physics.arcade.collide(this.sprite, this.groundLayer);

        //Make the sprite jump when the up key is pushed
        // if(this.cursors.up.isDown) {
        //     this.sprite.body.velocity.y = -500;
        // }

        if (this.cursors.up.isDown && this.sprite.body.onFloor()) {
            this.sprite.body.velocity.y = -600;
        }

        this.sprite.body.velocity.x = 0;

        if (this.cursors.right.isDown) {
            this.sprite.body.velocity.x = 250;
            this.sprite.animations.play('left');
        } else if (this.cursors.left.isDown) {
            this.sprite.body.velocity.x = -250;
            this.sprite.animations.play('right');
        }

        if (this.sprite.body.velocity.x === 0) {
            this.sprite.animations.stop();
        }

//        if(this.sprite.body.x > 400) {
//            this.displayWinText(537);
//        }
//        if(this.sprite.body.x < 40) {
//            this.displayLoseText(66);
//        }

    },
    displayWinText: function (pts) {
        if(!this.gameEndText){
            // this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height/2, 'interfont', ' Oh n0, 0ur her0 has fallen!\n\n Y0u g0t: 5o points\n\n Have y0u the heart to g0 0n,\n brave player?', 40);
            this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height/2, 'interfont', ' Congratulations! our her0\n has made it t0 the g0al!\n\n Y0u g0t: 540 points!\n\n Shall you try and best\n yourself, brave player?', 40);
//            this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height/2, 'interfont', ' Congratulations! our her0\n has made it t0 the g0al!\n\n Y0u g0t:' + pts +' points!\n\n Shall you try and best\n yourself, brave player?', 40);
            // this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height/2, 'interfont', 'Time: 01:27\nScore: 350', 24);
            this.gameEndText.anchor.x = 0.5;
            this.gameEndText.anchor.y = 0.5;
            this.gameEndText.smoothed = false;
            this.gameEndText.tint = 0x222222;
            this.displayReplayButton(0x33ff00);
        }
    },
    displayLoseText: function (pts) {
        this.sprite.visible = false;
        this.stage.backgroundColor = 0x993333;
        if(!this.gameEndText){
            this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y + this.camera.height/2, 'interfont', ' Oh n0, 0ur her0 has fallen!\n\n Y0u g0t: 70 points\n\n Have y0u the heart to g0 0n,\n brave player?', 40);
//            this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y + this.camera.height/2, 'interfont', ' Oh n0, 0ur her0 has fallen!\n\n Y0u g0t: ' + pts + ' points\n\n Have y0u the heart to g0 0n,\n brave player?', 40);
            this.gameEndText.anchor.x = 0.5;
            this.gameEndText.anchor.y = 0.5;
            this.gameEndText.smoothed = false;
            this.gameEndText.tint = 0x222222;
            this.displayReplayButton(0x33ff00);
        }
    }, displayReplayButton: function (tint) {
        this.startText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height*3/4, 'fat-and-tiny', 'CLICK ANYWHERE TO REPLAY.', 64);
        this.startText.anchor.x = 0.5;
        this.startText.smoothed = false;
        this.startText.tint = tint;
        this.input.onDown.addOnce(this.start, this);
    },
    start: function () {
        this.gameEndText = null;
        this.state.start('SpriteAnim.Game');
    }

};

var game = new Phaser.Game(960, 720, Phaser.AUTO, 'game');

game.state.add('SpriteAnim.Boot', SpriteAnim.Boot);
game.state.add('SpriteAnim.Preloader', SpriteAnim.Preloader);
game.state.add('SpriteAnim.MainMenu', SpriteAnim.MainMenu);
game.state.add('SpriteAnim.Game', SpriteAnim.Game);

game.state.start('SpriteAnim.Boot');
