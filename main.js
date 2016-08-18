var game = new Phaser.Game(960, 720, Phaser.AUTO, 'game');

game.state.add('SpriteAnim.Boot', SpriteAnim.Boot);
game.state.add('SpriteAnim.Preloader', SpriteAnim.Preloader);
game.state.add('SpriteAnim.MainMenu', SpriteAnim.MainMenu);
game.state.add('SpriteAnim.Game', SpriteAnim.Game);

game.state.start('SpriteAnim.Boot');
