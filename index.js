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

class Object
{
	image = new Image();
	posX = 0;
	posY = 0;
	texRect = new Rectangle();
	constructor() { this.image.onload = function() { main(); }; }
	setPos(X, Y) { this.posX = X; this.posY = Y; }
	setImage(path) { this.image.src = path; }
	containsPoint(pointX, pointY)
	{
		var contains = true;
		if (this.posX > pointX) { contains = false; } if (this.posY > pointY) { contains = false; }
		if (this.posX + this.image.width < pointX) { contains = false; }
		if (this.posY + this.image.width < pointY) { contains = false; }
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
				this.posX, this.posY, this.texRect.w, this.texRect.h);
		}
	}
}

let obj = new Object();
obj.setPos(100, 100);
obj.setImage('res/test.png');
obj.setTextureRect(new Rectangle(0, 0, 192, 192 / 2));

var click = null;

display.width = window.innerWidth; display.height = window.innerHeight;
document.addEventListener("touchstart", function(event) { click = event.touches; });
document.addEventListener("touchmove", function(event) { click = event.touches; });
document.addEventListener("resize", function() { display.width = window.innerWidth; display.height = window.innerHeight; });

function update(deltaTime)
{
	if (click == null) return;
	if (obj.containsPoint(click[0].pageX, click[0].pageY) === true)
	{
		obj.setPos(click[0].pageX - obj.image.width / 2, click[0].pageY - obj.image.height / 2);
	}
}

function render()
{
	context.clearRect(0, 0, display.width, display.height);
	obj.draw();
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