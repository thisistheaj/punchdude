/**
 * Created by ajbeckner on 8/18/16.
 */
SpriteAnim.Game = function () {
};

SpriteAnim.Game.prototype = {

    init: function () {},

    create: function () {

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = "#6699ff";

        this.map = this.add.tilemap('tilemap');
        //Params: addTilesetImage(<name of tilesheet in Tiled>, <key to the asset in Phaser>);
        this.map.addTilesetImage('TileKit', 'tiles');

        //Add both the background and ground layers. We won't be doing anything with the
        //GroundLayer though change
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

        this.hero = this.add.sprite(50, 960, 'guywalking');
        this.physics.arcade.enable(this.hero);

        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();

        //Set some physics on the sprite
        this.hero.body.bounce.y = 0.2;
        this.hero.body.gravity.y = 2000;

        this.hero.animations.add('left', [0, 1, 2], 10, true);
        this.hero.animations.add('right', [3, 4, 5], 10, true);
        this.hero.scale.x = 2;
        this.hero.scale.y = 2;
        //Make the camera follow the sprite
        this.camera.follow(this.hero);

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

        if (this.replayButton){
            this.replayButton.x = this.camera.x + this.camera.width/2;
            this.replayButton.y = this.camera.y + this.camera.height*3/4;
        }

        //Make the sprite collide with the ground layer
        this.physics.arcade.collide(this.hero, this.groundLayer);

        this.moveHero();
        this.checkWin();
    },

    displayWinText: function (pts) {
        this.displayGameEndText(' Congratulations! our her0\n has made it t0 the g0al!\n\n Y0u g0t: 540 points!\n\n Shall you try and best\n yourself, brave player?');
    },

    displayLoseText: function (pts) {
        this.hero.visible = false;
        this.stage.backgroundColor = 0x993333;
        this.displayGameEndText(' Oh n0, 0ur her0 has fallen!\n\n Y0u g0t: 70 points\n\n Have y0u the heart to g0 0n,\n brave player?');
    },

    displayGameEndText: function (text) {
        if(!this.gameEndText){
            this.gameEndText = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y + this.camera.height/2, 'interfont', text, 40);
            this.gameEndText.anchor.x = 0.5;
            this.gameEndText.anchor.y = 0.5;
            this.gameEndText.smoothed = false;
            this.gameEndText.tint = 0x222222;
            this.displayReplayButton(0x33ff00);
        }
    },

    displayReplayButton: function (tint) {
        this.replayButton = this.add.bitmapText(this.camera.x + this.camera.width/2, this.camera.y +this.camera.height*3/4, 'fat-and-tiny', 'CLICK ANYWHERE TO REPLAY.', 64);
        this.replayButton.anchor.x = 0.5;
        this.replayButton.smoothed = false;
        this.replayButton.tint = tint;
        this.input.onDown.addOnce(this.start, this);
    },

    start: function () {
        this.gameEndText = null;
        this.state.start('SpriteAnim.Game');
    },

    moveHero: function () {
        if (this.cursors.up.isDown && this.hero.body.onFloor()) {
            this.hero.body.velocity.y = -600;
        }

        this.hero.body.velocity.x = 0;

        if (this.cursors.right.isDown) {
            this.hero.body.velocity.x = 250;
            this.hero.animations.play('left');
        } else if (this.cursors.left.isDown) {
            this.hero.body.velocity.x = -250;
            this.hero.animations.play('right');
        }

        if (this.hero.body.velocity.x === 0) {
            this.hero.animations.stop();
        }


    },

    checkWin: function () {
        if(this.hero.body.x > 400) {
            this.displayWinText(537);
        }
        if(this.hero.body.x < 40) {
            this.displayLoseText(66);
        }
    }

};
