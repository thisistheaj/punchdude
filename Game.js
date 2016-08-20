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

        var playerPosition = this.findObjectsByType('playerStart', this.map, 'Objects');
        var enemyPositions = this.findObjectsByType('enemy1', this.map, 'Objects');


        this.enemies = this.makeEnemies(enemyPositions);
        this.makeHero(playerPosition);
        this.camera.follow(this.hero);

        //Enable cursor keys so we can create some controls
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createScoreText();
        this.createTimeText();

        this.winButton = this.add.button(10,this.world.height - 100,'myButton',this.displayWinText,this,1,0,2);
        this.loseButton = this.add.button(960 - 100,this.world.height - 100,'myButton',this.displayLoseText,this,4,3,5);
        this.loseButton = this.add.button(this.camera.width/2 ,this.world.height - 100,'myButton',this.addScore,this,4,3,5);

        this.score = 0;
        this.totalSeconds = 0;
        this.time.events.loop(Phaser.Timer.SECOND, this.incrementTime, this);
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
        for (var i = 0; i < this.enemies.length; i++) {
            this.physics.arcade.collide(this.enemies[i], this.groundLayer);
        }
        this.moveHero();
        this.checkWin();
        this.updateScoreText();
        this.updateTimeText();
    },

    displayWinText: function () {
        this.displayGameEndText(' Congratulations! our her0\n has made it t0 the g0al!\n\n Y0u g0t: ' + this.score +' points!\n\n Shall you try and best\n yourself, brave player?');
    },

    displayLoseText: function () {
        this.hero.visible = false;
        this.stage.backgroundColor = 0x993333;
        this.displayGameEndText(' Oh n0, 0ur her0 has fallen!\n\n Y0u g0t: ' + this.score +' points\n\n Have y0u the heart to g0 0n,\n brave player?');
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

    createScoreText: function () {
        this.scoreText = this.add.bitmapText(this.camera.x + 20, this.camera.y + 70, 'interfont', "Score: 0", 40);
        this.scoreText.anchor.x = 0;
        this.scoreText.anchor.y = 0;
        this.scoreText.smoothed = false;
        this.scoreText.tint = 0x222222;
    },

    updateScoreText: function () {
        this.scoreText.x = this.camera.x + 20;
        this.scoreText.y = this.camera.y + 70;
        this.scoreText.setText("Score: " + this.score)
    },

    createTimeText: function () {
        this.timeText = this.add.bitmapText(this.camera.x + 20, this.camera.y + 20, 'interfont', "Time: 02:00", 40);
        this.timeText.anchor.x = 0;
        this.timeText.anchor.y = 0;
        this.timeText.smoothed = false;
        this.timeText.tint = 0x222222;
    },

    updateTimeText: function () {
        this.timeText.x = this.camera.x + 20;
        this.timeText.y = this.camera.y + 20;
        // this.totalSeconds = Math.floor(this.totalSeconds++);
        // this.totalSeconds++;
        var totalSecondsLeft = 120 - this.totalSeconds;
        var minutes = Math.floor(totalSecondsLeft / 60);
        var seconds = Math.floor(totalSecondsLeft % 60);
        if (minutes < 10) { minutes = "0" + minutes}
        if (seconds < 10) { seconds = "0" + seconds}
        this.timeText.setText("Time: " + minutes + ":" +seconds);
    },
    incrementTime: function () {
        if(!this.gameEndText){
            if (this.totalSeconds < 120) {
                this.totalSeconds++;
            } else {
                this.displayLoseText()
            }
        }
    },

    addScore: function () {
        this.score += 50;
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
        if(this.hero.body.x > 5400) {
            this.displayWinText(537);
        }
    },

    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            if(element.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    makeHero: function (result) {
        this.hero = this.game.add.sprite(result[0].x, result[0].y, 'guywalking');

        this.physics.arcade.enable(this.hero);
        this.hero.body.bounce.y = 0.2;
        this.hero.body.gravity.y = 2000;

        this.hero.animations.add('left', [0, 1, 2], 10, true);
        this.hero.animations.add('right', [3, 4, 5], 10, true);

        this.hero.scale.x = 2;
        this.hero.scale.y = 2;

        this.camera.follow(this.hero);

    },

    makeEnemies: function (results) {
        var enemies = [];
        for (var i = 0; i < results.length; i++) {
            var enemy = this.game.add.sprite(results[i].x, results[i].y, 'guywalking');
            this.physics.arcade.enable(enemy);
            enemy.body.bounce.y = 0.2;
            enemy.body.gravity.y = 2000;

            enemy.animations.add('left', [0, 1, 2], 10, true);
            enemy.animations.add('right', [3, 4, 5], 10, true);

            enemy.scale.x = 2;
            enemy.scale.y = 2;
            enemies.push(enemy);
        }
        return enemies;
    }

};
