var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var map;
var groundLayer;

function preload ()
{
    this.load.image('background', 'assets/img/AYDixaJ.jpg.png');
    this.load.tilemapTiledJSON('map', 'assets/basiclayer.json');
}

function create () {
    this.add.image(400, 300, 'background');
    map = this.make.tilemap({ key: 'map' });
    map.createDynamicLayer('Background Layer', groundTiles, 0, 0);
    groundLayer = map.createDynamicLayer('Ground Layer', groundTiles, 0, 0);
}