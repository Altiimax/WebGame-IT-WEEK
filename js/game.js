// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(1300, 800, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update })

// Declare shared variables at the top so all methods can access them
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player
let spikes
let spikesTop

function preload () {
    // Load & Define our game assets
    game.load.image('background', 'assets/img/background.png')
    game.load.image('ground', 'assets/img/ground.png')
    game.load.image('platform', 'assets/img/platform.png')
    game.load.image('diamond', 'assets/img/diamond.png')
    game.load.image('spike', 'assets/img/spike.png', 32, 32)
    game.load.spritesheet('redchar', 'assets/img/redchar.png', 32, 32)
}

function createPlatform(ledge, platforms, x, y, xScale, yScale, image, immovable = true, visible = true) {
    ledge = platforms.create(x, y, image);
    ledge.body.immovable = immovable;
    ledge.visible = visible;
    ledge.scale.setTo(xScale, yScale);
}

function create () {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    game.add.sprite(0, 0, 'background')

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group()

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true

    // Here we create the ground.
    let ground = platforms.create(0, game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(4, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    let spike;
    spikes = game.add.group();
    spikes.enableBody = true;

    let invisbleSpike;
    invisbleSpikes = game.add.group();
    invisbleSpikes.enableBody = true;

    //  Now let's create two ledges
    let ledge;
    createPlatform(ledge, platforms, 100, 640, 0.2, 0.5, 'platform');
    createPlatform(invisbleSpike, invisbleSpikes, 100, 610, 0.2, 0.2);
    //createPlatform(invisbleSpike, invisbleSpikes, 125, 610, 0.2, 0.2, 'spike', true, false);
    //createPlatform(invisbleSpike, invisbleSpikes, 150, 610, 0.2, 0.2, 'spike', true, false);
    createPlatform(ledge, platforms, 250, 640, 0.2, 0.5, 'platform');
    createPlatform(ledge, platforms, 430, 580, 0.2, 0.5, 'platform');
    createPlatform(ledge, platforms, 580, 520, 0.2, 0.5, 'platform');
    createPlatform(ledge, platforms, 730, 460, 0.2, 0.5, 'platform');

    //to the left
    createPlatform(ledge, platforms, 550, 400, 0.2, 0.5, 'platform', true, false);
    createPlatform(ledge, platforms, 400, 340, 0.2, 0.5, 'platform');

    let num = Math.floor(Math.random() * 2);

    if(num === 0){
        createPlatform(ledge, platforms, 250, 250, 0.2, 0.5, 'platform', false);
        createPlatform(ledge, platforms, 550, 250, 0.2, 0.5, 'platform', true);
    } else {
        createPlatform(ledge, platforms, 250, 250, 0.2, 0.5, 'platform', true);
        createPlatform(ledge, platforms, 550, 250, 0.2, 0.5, 'platform', false);
    }

    //to the right
    createPlatform(ledge, platforms, 880, 400, 0.2, 0.5, 'platform', true);
    createPlatform(ledge, platforms, 1030, 340, 0.2, 0.5, 'platform', true);
    createPlatform(ledge, platforms, 1180, 280, 0.2, 0.5, 'platform', true);

    ledge = platforms.create(600, 650, 'platform')
    ledge.body.immovable = true
    ledge.scale.setTo(0.2, 0.5)

    let counter = 500
    let leftCorner = 0

    for( let i = 0; i < 25; i++ ){
        spike  = spikes.create(counter, 705, 'spike')
        spike.body.immovable = true
        spike.scale.setTo(0.2, 0.2)
        counter += 25
    }

    for (let i =0; i< 60; i++){
    	spike = spikes.create(leftCorner, 30, 'spike')
    	spike.body.immovable = true
    	spike.scale.setTo(0.2, 0.2)
    	spike.angle = -180
    	leftCorner += 25
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'redchar')

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)
    player.scale.setTo(1.4, 1.4)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2
    player.body.gravity.y = 800
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [3, 4], 10, true)
    player.animations.add('right', [1, 2], 10, true)

    //  Finally some diamonds to collect
    diamonds = game.add.group()

    //  Enable physics for any object that is created in this group
    diamonds.enableBody = true

    //  Create diamonds to collect
        let diamond = diamonds.create(620, 600, 'diamond')

        //  Drop em from the sky and bounce a bit
        diamond.body.gravity.y = 1000
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2

    //  Create the score text
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#FFF' })

    //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys()
}

function update () {
    //  We want the player to stop when not moving
    player.body.velocity.x = 0

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)
    game.physics.arcade.overlap(player, spikes, killPlayer, null, this)
    game.physics.arcade.overlap(player, invisbleSpikes, () => {
        for(let i = 0, len = invisbleSpikes.children.length; i < len; i++) {
            invisbleSpikes.children[i].visible = true;
            killPlayer();
        }
    }, null, this);

    // Configure the controls!
    if (cursors.left.isDown) {
        player.body.velocity.x = -200

        player.animations.play('left')
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 200

        player.animations.play('right')
    } else {
        // If no movement keys are pressed, stop the player
        player.animations.stop()
    }

    //  This allows the player to jump!
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -400
    }
    // Show an alert modal when score reaches 120
    if (score === 120) {
        alert('You win!')
        score = 0
    }
}

function collectDiamond (player, diamond) {
    // Removes the diamond from the screen
    diamond.kill()

    //create(); => restarts the game

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
    return true
}

function killPlayer() {
    create();
}