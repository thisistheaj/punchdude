/**
 * Created by ajbeckner on 8/18/16.
 */
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

