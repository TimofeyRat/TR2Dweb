var display = document.getElementById("display");
var context = display.getContext('2d');
var lastTime = Date.now();

window.onscroll = () => { window.scroll(0, 0); }
document.body.style.overflow = "hidden";

class Vector2
{
	x = 0; y = 0;
	constructor(X = 0, Y = 0) { this.x = X; this.y = Y; }
}

class Rectangle
{
	x = 0; y = 0; w = 0; h = 0;
	constructor(X = 0, Y = 0, W = 0, H = 0) { this.x = X; this.y = Y; this.w = W; this.h = H; }
	containsPoint(point = new Vector2())
	{
		var contains = true;
		if (this.posX > point.x) { contains = false; } if (this.posY > point.y) { contains = false; }
		if (this.texRect.w != 0 && this.texRect.h != 0)
		{
			if (this.posX + this.texRect.w * this.scaleX < point.x) { contains = false; }
			if (this.posY + this.texRect.h * this.scaleY < point.y) { contains = false; }
		}
		else
		{
			if (this.posX + this.image.width * this.scaleX < point.x) { contains = false; }
			if (this.posY + this.image.width * this.scaleY < point.y) { contains = false; }
		}
		return contains;
	}
	containsPoint(pointX = 0, pointY = 0)
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
	intersects(rect = new Rectangle())
	{
		var r1minX = Math.min(this.x, this.x + this.w);
		var r1maxX = Math.max(this.x, this.x + this.w);
		var r1minY = Math.min(this.y, this.y + this.h);
		var r1maxY = Math.max(this.y, this.y + this.h);

		var r2minX = Math.min(rect.x, rect.x + rect.w);
		var r2maxX = Math.max(rect.x, rect.x + rect.w);
		var r2minY = Math.min(rect.y, rect.y + rect.h);
		var r2maxY = Math.max(rect.y, rect.y + rect.h);

		var interLeft = Math.max(r1minX, r2minX);
		var interTop = Math.max(r1minY, r2minY);
		var interRight = Math.min(r1maxX, r2maxX);
		var interBottom = Math.min(r1maxY, r2maxY);

		return ((interLeft < interRight) && (interTop < interBottom));
	}
}

class Trigger
{
	rect = new Rectangle();
	name = '';
	constructor(rectangle = new Rectangle(), Name = '')
	{
		this.rect = rectangle;
		this.name = Name;
	}
}

var triggers = new Array();
triggers.push(new Trigger(new Rectangle(0, 500, 128, 64), 'physic'));

class TRAnimation
{
	image = new Image();
	frames = new Array();
	currentFrame = 0;
	speed = 0;
	name = ' ';
	constructor(src = '', Frame = new Vector2(), animSpeed = 0, animName = ' ', frameCount = 256, offset = 0)
	{
		this.image.src = src;
		let framesArr = new Array();
		this.speed = animSpeed;
		this.name = animName;
		this.image.onload = function()
		{
			let texCountX, texCountY;
			texCountX = this.width / Frame.x; texCountY = this.height / Frame.y;
			for (let y = 0; y < texCountY; y++)
			{
				for (let x = 0; x < texCountX; x++)
				{
					if (y * texCountX + x >= offset)
					if (framesArr.length < frameCount) framesArr.push(new Rectangle(x * Frame.x, y * Frame.y, Frame.x, Frame.y));
				}
			}
		};
		this.frames = framesArr;
	}
	update(delta = 0)
	{
		this.currentFrame += this.speed * delta;
		if (this.currentFrame > this.frames.length - 1)
		{
			this.currentFrame -= this.frames.length;
			if (this.currentFrame < 0) this.currentFrame = 0;
		}
	}
	get(frame = 0) { return this.frames[Math.round(frame)]; }
	getCurrentFrame() { return this.get(this.currentFrame); }
}

class TRAnimManager
{
	anims = new Array();
	currentAnimID = 0;
	constructor() {}
	addAnim(animation = new TRAnimation())
	{
		this.anims.push(animation);
	}
	setAnim(name = ' ')
	{
		for (let i = 0; i < this.anims.length; i++)
		{
			if (this.anims[i].name == name)
			{
				this.currentAnimID = i;
			}
		}
	}
	getCurrentAnim() { return this.anims[this.currentAnimID]; }
	getAnim(name = ' ')
	{
		for (let i = 0; i < this.anims.length; i++)
		{
			if (this.anims[i].name == name)
			{
				return this.anims[i];
			}
		}
	}
}

class TRObject
{
	image = new Image();
	posX = 0;
	posY = 0;
	dx = 0;
	dy = 0;
	scaleX = 1;
	scaleY = 1;
	texRect = new Rectangle();
	onGround = false;
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
	getRect() { return new Rectangle(this.posX, this.posY, (this.texRect.w != 0 ? this.texRect.w : this.image.width) * this.scaleX, (this.texRect.h != 0 ? this.texRect.h : 0) * this.scaleY); }
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
		if (this.texRect.w == 0 || this.texRect.h == 0)
		{
			context.drawImage(this.image, this.posX, this.posY);
		}
		else
		{
			if (this.scaleX < 0)
			{
				context.translate(this.posX + this.texRect.w * (this.scaleX * -1), this.posY);
				context.scale(-1, 1);		
				context.drawImage(this.image,
					this.texRect.x, this.texRect.y, this.texRect.w, this.texRect.h,
					0, 0, this.texRect.w * (this.scaleX * -1), this.texRect.h * this.scaleY);
				context.setTransform(1, 0, 0, 1, 0, 0);
			}
			else
			{
				context.drawImage(this.image,
					this.texRect.x, this.texRect.y, this.texRect.w, this.texRect.h,
					this.posX, this.posY, this.texRect.w * this.scaleX, this.texRect.h * this.scaleY);
			}
		}
	}
	collision(dir = 0)
	{
		for (let i = 0; i < triggers.length; i++)
		{
			if (new Rectangle(this.posX, this.posY, this.texRect.w != 0 ? this.texRect.w : this.image.width, this.texRect.h != 0 ? this.texRect.h : this.image.height).intersects(triggers[i].rect))
			{
				var width = this.texRect.w != 0 ? this.texRect.w : this.image.width;
				var height = this.texRect.h != 0 ? this.texRect.h : this.image.height;
				if (triggers[i].name == 'physic')
				{
					if (this.dx < 0 && dir == 0) { this.posX = triggers[i].rect.x + triggers[i].rect.w; this.dx = 0; }
					if (this.dx > 0 && dir == 0) { this.posX = triggers[i].rect.x - width; this.dy = 0; }
					if (this.dy > 0 && dir == 1) { this.posY = triggers[i].rect.y - height; this.dy = 0; this.onGround = true; }
					if (this.dy < 0 && dir == 1) { this.posY = triggers[i].rect.y + triggers[i].rect.h; this.dy = 0; }
				}
			}
		}
	}
}

function getWindowRect() { return new Rectangle(0, 0, display.width, display.height); };

class Player
{
	object = new TRObject();
	anim = new TRAnimManager();
	constructor(animation = new TRAnimation(), pos = new Vector2())
	{
		this.anim.addAnim(animation);
		this.object.setPos(pos.x, pos.y);
	}
	update(deltaTime)
	{
		this.anim.getCurrentAnim().update(deltaTime);
		this.object.posX += this.object.dx * deltaTime;
		this.object.collision(0);
		if (!this.object.onGround) this.object.dy += 350 * deltaTime;
		this.object.onGround = false;
		this.object.posY += this.object.dy * deltaTime;
		this.object.collision(1);
		if (this.object.posX < -this.object.getRect().w) { this.object.posX = display.width; }
		if (this.object.posX > display.width) { this.object.posX = -this.object.getRect().w; }
		if (this.object.posY < -this.object.getRect().h) { this.object.posY = display.height; }
		if (this.object.posY > display.height) { this.object.posY = -this.object.getRect().h; }
		this.object.dx = 0;
	}
	draw()
	{
		this.object.setImage(this.anim.getCurrentAnim().image);
		this.object.setTextureRect(this.anim.getCurrentAnim().get(this.anim.getCurrentAnim().currentFrame));
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
		this.leftMove.setPos(0, display.height - this.leftMove.getRect().h);
		this.downMove.setPos(this.leftMove.getRect().x + this.leftMove.getRect().w, this.leftMove.getRect().y);
		this.rightMove.setPos(this.downMove.getRect().x + this.downMove.getRect().w, this.leftMove.getRect().y);
		this.upMove.setPos(this.downMove.getRect().x, this.downMove.getRect().y - this.upMove.getRect().h);
	}
	update(deltaTime, click, player)
	{
		if (click.length == 0) { return; }
		if (this.leftMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.dx = -100;
			player.scaleX = 1;
		}
		if (this.rightMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			player.dx = 100;
			player.scaleX = -1;
		}
		if (this.downMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			//player.dy = 50;
		}
		if (this.upMove.containsPoint(click[0].pageX, click[0].pageY))
		{
			if (player.onGround)
			{
				player.onGround = false;
				player.dy = -250;
			}
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
document.addEventListener("touchstart", (event) => { click = event.touches; });
document.addEventListener("touchmove", (event) => { click = event.touches; });
document.addEventListener("touchend", (event) => { click = event.touches; });
document.addEventListener("resize", () =>
{
	display.width = window.innerWidth;
	display.height = window.innerHeight;
	ui.resizeUI();
});

var player = new Player(new TRAnimation('res/playerAnim.png', new Vector2(31, 64), 4, 'stay', 4), new Vector2(50, 50));
player.anim.addAnim(new TRAnimation('res/playerAnim.png', new Vector2(31, 64), 4, 'walk', 4, 4));

function update(deltaTime)
{
	if (click == null) return;
	player.update(deltaTime);
	ui.resizeUI();
	ui.update(deltaTime, click, player.object);
}

function testRender() {}

function render()
{
	context.clearRect(0, 0, display.width, display.height);
	testRender();
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