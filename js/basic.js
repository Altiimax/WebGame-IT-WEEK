const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
/*
load image/sprite here
 */
function preload ()
{
    this.load.image('sky', 'path_to_img');
}

//add image to screen
function create ()
{
    this.add.image(400, 300, 'sky')
}

function update ()
{
}