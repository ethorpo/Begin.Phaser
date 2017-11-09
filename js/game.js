var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var coins;
var coin;
var attacks;
var attack;
var platform;
var edge;
var player;
var small;
var sword;
var smallMove = -100;
var swordMove = 100;
var key1;

function preload() {
	
	//game.load.image('backrgound', 'img/background.png');
	game.load.image('coins', 'img/coin.png');
	game.load.image('platform', 'img/platform.png');
	//game.load.image('player', 'img/player.png');
	game.load.image('sky', 'img/sky.png');
	game.load.spritesheet('dude', 'img/dude.png', 32, 48);
	game.load.image('bad-guy-small', 'img/bad-guy-small.png');
	game.load.image('bad-guy-sword', 'img/bad-guy-sword.png');
	game.load.image('stop', 'img/stop.png');
	game.load.image('attack', 'img/attack.png');
	
}

function create() {
	
	    cursors = game.input.keyboard.createCursorKeys();
		key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//World
	    game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'sky');
		platform = game.add.group();
		platform.enableBody = true;
		edge = game.add.group();
		edge.enableBody = true;
		var ground = platform.create(0, game.world.height - 32, 'platform');
		ground.body.immovable = true;
		ground = platform.create(400, game.world.height - 32, 'platform');
		ground.body.immovable = true;
		var ledge = platform.create(400, 400, 'platform');
		ledge.body.immovable = true;
		ledge = platform.create(-100, 250, 'platform');
		ledge.body.immovable = true;
		var stop = edge.create(375, 350, 'stop');
		stop.body.immovable = true;
		stop = edge.create(300, 200, 'stop');
		stop.body.immovable = true;
		stop = edge.create(790, 350, 'stop');
		stop.body.immovable = true;
		stop = edge.create(-9, 200, 'stop');
		stop.body.immovable = true;
		
		//Pickups
		
		coins = game.add.group();
		coins.enableBody = true;
		var coin = coins.create(700, 300, 'coins');
		coin.scale.setTo(0.5, 0.5);
		coin = coins.create(20, 150, 'coins');
		coin.scale.setTo(0.5, 0.5);
		coin = coins.create(400, 100, 'coins');
		coin.scale.setTo(0.5, 0.5);
		
		
		//enimies
		
		small = game.add.sprite(600, 250, 'bad-guy-small');
		game.physics.arcade.enable(small);
		small.enableBody = true;
		small.body.gravity.y = 5000;
		small.body.collideWorldBounds = true;
		
		sword = game.add.sprite(20, 150, 'bad-guy-sword');
		game.physics.arcade.enable(sword);
		sword.enableBody = true;
		sword.body.gravity.y = 5000;
		sword.body.collideWorldBounds = true;
		
		//Player
		
		player = game.add.sprite(32, game.world.height - 150, 'dude');
		game.physics.arcade.enable(player);
		player.body.gravity.y = 5000;
		player.body.collideWorldBounds = true;
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
				
		//swords
		
		attacks = game.add.group();
		attacks.enableBody = true;
}

function update() {

	var hitPlatform = game.physics.arcade.collide(small, platform);
	hitPlatform = game.physics.arcade.collide(sword, platform);
	hitPlatform = game.physics.arcade.collide(player, platform);
		small.body.velocity.x = 0;
	    player.body.velocity.x = 0;
		sword.body.velocity.x = 0;
	game.physics.arcade.overlap(player, coins, collectcoins, null, this);
	game.physics.arcade.overlap(small, attacks, fightSmall, null, this);
	game.physics.arcade.overlap(sword, attacks, fightSword, null, this);
	game.physics.arcade.overlap(player, sword, die, null, this);
	game.physics.arcade.overlap(player, small, die, null, this);
	game.physics.arcade.overlap(small, edge, smallTurn, null, this);
	game.physics.arcade.overlap(sword, edge, swordTurn, null, this);	
		
	//player
		
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -1500;
	}
	if (key1.isDown)
	{
		var attack = attacks.create(player.body.x + 50, player.body.y, 'attack');
		//player.attacks.anchor.set(0.5, 0.5);
		//player.addChild(player.attacks);
	}
	else {
		resetAttack(attacks);
	}
		
	//enimies
	
	if (player.body.x < small.body.x && player.body.y > small.body.y - 50 && player.body.y < small.body.y + 50 && hitPlatform)
	{
		smallMove = -300;
	}
	else if (player.body.x > small.body.x && player.body.y > small.body.y - 50 && player.body.y < small.body.y + 50 && hitPlatform)
	{
		smallMove = 300;
	}
		
	else (small.body.velocity.x = 0)
	{
		small.body.velocity.x = smallMove;
	}
		
	if (player.body.x < sword.body.x && player.body.y > sword.body.y - 50 && player.body.y < sword.body.y + 50 && hitPlatform)
	{
		swordMove = -100;
	}
	else if (player.body.x > sword.body.x && player.body.y > sword.body.y - 50 && player.body.y < sword.body.y + 50 && hitPlatform)
	{
		swordMove = 100;
	}
	else (sword.body.velocity.x = 0)
	{
		sword.body.velocity.x = swordMove;
	}
}

function fightSmall (small, attack) {
	
	small.kill();
	
}

function fightSword (sword, attack) {
	
	sword.kill();
	
}

function collectcoins (player, coin) {
	
		coin.kill();
}

function die (player, small, sword) {
	player.kill();
}


function smallTurn (small, stop) {
	
	smallMove = smallMove * -1;

}

function swordTurn (sword, stop) {
	
	swordMove = swordMove * -1;

}

function resetAttack (attack) {
	
	attack.kill();
}