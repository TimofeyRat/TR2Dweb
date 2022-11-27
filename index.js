var display = document.getElementById("display");
var context = display.getContext('2d');
var lastTime = Date.now();

window.onscroll = () => { window.scroll(0, 0); }
document.body.style.overflow = "hidden";

class Rectangle
{
	x = 0; y = 0; w = 0; h = 0;
	constructor(X = 0, Y = 0, W = 0, H = 0) { this.x = X; this.y = Y; this.w = W; this.h = H; }
}

class Vector2
{
	x = 0; y = 0;
	constructor(X = 0, Y = 0) { this.x = X; this.y = Y; }
}

class TRAnimation
{
	image = new Image();
	frames = new Array();
	currentFrame = 0;
	speed = 0;
	constructor(src = '', Frame = new Vector2(), animSpeed = 0)
	{
		this.image.src = src;
		let framesArr = new Array();
		this.speed = animSpeed;
		this.image.onload = function()
		{
			let texCountX, texCountY;
			texCountX = this.width / Frame.x; texCountY = this.height / Frame.y;
			console.log(texCountX + ' ' + texCountY);
			for (let y = 0; y < texCountY; y++)
			{
				for (let x = 0; x < texCountX; x++)
				{
					framesArr.push(new Rectangle(x * Frame.x, y * Frame.y, Frame.x, Frame.y));
				}
			}
		};
		this.frames = framesArr;
	}
	update(delta = 0) { this.currentFrame += this.speed * delta; if (this.currentFrame > this.frames.length - 1) { this.currentFrame = 0; } }
	get(frame = 0) { return this.frames[Math.round(frame)]; }
	getCurrentFrame() { return this.get(this.currentFrame); }
}

class TRObject
{
	image = new Image();
	posX = 0;
	posY = 0;
	scaleX = 1;
	scaleY = 1;
	texRect = new Rectangle();
	constructor() {}
	setCenter(X, Y)
	{
		if (this.texRect.w > 0 && this.texRect.h > 0)
		{
			this.posX = X - this.texRect.w / 2;
			this.posY = Y - this.texRect.h / 2;
		}
		else
		{
			this.posX = X - this.image.width / 2;
			this.posY = Y - this.image.height / 2;
		}
	}
	setPos(X, Y) { this.posX = X; this.posY = Y; }
	loadImage(path) { this.image.src = path; }
	setImage(image) { this.image = image; }
	setObjScale(X, Y) { this.scaleX = X; this.scaleY = Y; }
	containsPoint(pointX, pointY)
	{
		var contains = true;
		if (this.posX > pointX) { contains = false; } if (this.posY > pointY) { contains = false; }
		if (this.texRect.w != 0 && this.texRect.h != 0)
		{
			if (this.posX + this.texRect.w * this.scaleX < pointX) { contains = false; }
			if (this.posY + this.texRect.h * this.scaleY < pointY) { contains = false; }
		}
		else
		{
			if (this.posX + this.image.width * this.scaleX < pointX) { contains = false; }
			if (this.posY + this.image.width * this.scaleY < pointY) { contains = false; }
		}
		return contains;
	}
	setTextureRect(rect = new Rectangle())
	{
		this.texRect = rect;
	}
	draw()
	{
		if (this.texRect.w == 0 || this.texRect.h == 0) { context.drawImage(this.image, this.posX, this.posY); }
		else
		{
			context.drawImage(this.image,
				this.texRect.x, this.texRect.y, this.texRect.w, this.texRect.h,
				this.posX, this.posY, this.texRect.w * this.scaleX, this.texRect.h * this.scaleY);
		}
	}
	move(dX, dY, deltaTime)
	{
		this.posX += dX * deltaTime;
		this.posY += dY * deltaTime;
	}
	getBounds()
	{
		if (this.texRect.w != 0 && this.texRect.h != 0) return new Rectangle(this.posX, this.posY, this.texRect.w * this.scaleX, this.texRect.h * this.scaleY);
	}
}

class Player
{
	object = new TRObject();
	anim = new TRAnimation();
	constructor(animation = new TRAnimation(), pos = new Vector2())
	{
		this.anim = animation;
		this.object.setPos(pos.x, pos.y);
	}
	update(deltaTime)
	{
		this.anim.update(deltaTime);
	}
	draw()
	{
		this.object.setImage(this.anim.image);
		this.object.setTextureRect(this.anim.get(this.anim.currentFrame));
		this.object.draw();
	}
}

class UI
{
	leftMove = new TRObject();
	rightMove = new TRObject();
	downMove = new TRObject();
	upMove = new TRObject();
	constructor()
	{
		this.leftMove.image.src = 'res/ui_buttons.png';
		this.leftMove.setTextureRect(new Rectangle(44, 44, 44, 44));
		this.leftMove.setObjScale(2, 2);
		this.rightMove.image.src = 'res/ui_buttons.png';
		this.rightMove.setTextureRect(new Rectangle(44, 0, 44, 44));
		this.rightMove.setObjScale(2, 2);
		this.downMove.image.src = 'res/ui_buttons.png';
		this.downMove.setTextureRect(new Rectangle(0, 44, 44, 44));
		this.downMove.setObjScale(2, 2);
		this.upMove.image.src = 'res/ui_buttons.png';
		this.upMove.setTextureRect(new Rectangle(0, 0, 44, 44));
		this.upMove.setObjScale(2, 2);
		this.resizeUI();
	}
	resizeUI()
	{
		this.leftMove.setPos(0, display.height - this.leftMove.getBounds().h);
		this.downMove.setPos(this.leftMove.getBounds().x + this.leftMove.getBounds().w, this.leftMove.getBounds().y);
		this.rightMove.setPos(this.downMove.getBounds().x + this.downMove.getBounds().w, this.leftMove.getBounds().y);
		this.upMove.setPos(this.downMove.getBounds().x, this.downMove.getBounds().y - this.upMove.getBounds().h);
	}
	update(deltaTime, click, player)
	{
		if (click.length == 0) { return; }
		if (this.leftMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.move(-50, 0, deltaTime);
		}
		if (this.rightMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.move(50, 0, deltaTime);
		}
		if (this.downMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.move(0, 50, deltaTime);
		}
		if (this.upMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.move(0, -50, deltaTime);
		}
	}
	draw()
	{
		this.leftMove.draw();
		this.rightMove.draw();
		this.downMove.draw();
		this.upMove.draw();
	}
}

var ui = new UI();

var click = null;

display.width = window.innerWidth; display.height = window.innerHeight;
document.addEventListener("touchstart", function(event) { click = event.touches; });
document.addEventListener("touchmove", function(event) { click = event.touches; });
document.addEventListener("touchend", function(event) { click = event.touches; });
document.addEventListener("resize", function()
{
	display.width = window.innerWidth;
	display.height = window.innerHeight;
	ui.resizeUI();
});

var player = new Player(new TRAnimation('res/playerAnim.png', new Vector2(31, 64), 4), new Vector2(50, 50));

function update(deltaTime)
{
	if (click == null) return;
	player.update(deltaTime);
	ui.resizeUI();
	ui.update(deltaTime, click, player.object);
}

function render()
{
	context.clearRect(0, 0, display.width, display.height);
	player.draw();
	ui.draw();
}

function main()
{
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;
	
	update(dt);
	render();
	
	lastTime = now;
	requestAnimationFrame(main);
}

main();