"use-strict";

function AddClass(InClassName)
{
	const VideoElements = document.getElementsByTagName('video');
	for (var i = 0; i < VideoElements.length; i++)
	{
		if (VideoElements[i].className.indexOf(InClassName) == -1)
		{
			VideoElements[i].className += ' ' + InClassName;
		}

		console.log("[UltraWide] AddClass", VideoElements[i], InClassName);
	}
}

function RemoveClass(InClassName)
{
	const VideoElements = document.getElementsByTagName('video');
	for (var i = 0; i < VideoElements.length; i++)
	{
		VideoElements[i].className = VideoElements[i].className.replace(InClassName, '');
		console.log("[UltraWide] RemoveClass", VideoElements[i], InClassName);
	}
}

UltraWide.prototype.Update = function()
{
	const StretchClassName = "ExtraClassStretch";
	const CropClassName = "ExtraClassCrop";
	RemoveClass(StretchClassName);
	RemoveClass(CropClassName);
	this.CurrentScale = 1;

	if (document.webkitIsFullScreen == false)
	{
		return;
	}

	const AspectRatio = screen.width / screen.height;
	console.log("[UltraWide] Checking aspect ratio", screen.width, screen.height, AspectRatio);
	if (AspectRatio > 1.77)
	{
		this.CurrentScale = Math.round((AspectRatio / 1.77) * 100) / 100;
	}
	
	this.Styles.innerHTML =
	"." + StretchClassName + "{ -webkit-transform:scaleX(" + this.CurrentScale + ")!important; }" +
	"." + CropClassName + "{ -webkit-transform:scale(" + this.CurrentScale + ")!important; }";
	
	switch (this.CurrentMode)
	{
		case ModeTypes.Disabled:
		{
			break; // Do nothing, classes have already been removed
		}
		case ModeTypes.Stretch:
		{
			if (this.CurrentScale > 1)
			{
				AddClass(StretchClassName);
			}
			break;
		}
		case ModeTypes.Crop:
		{
			if (this.CurrentScale > 1)
			{
				AddClass(CropClassName);
			}
			break;
		}
	}

	console.log("[UltraWide] Page Update", this.CurrentMode, this.CurrentScale);
}

function UltraWide()
{
	this.CurrentMode = ModeTypes.Disabled;
	this.CurrentScale = 1;
	this.Styles = document.createElement('style');
	document.body.appendChild(this.Styles);

	document.addEventListener('webkitfullscreenchange', function(e)
	{
		this.update();
	}.bind(this));

	document.addEventListener('keydown', function(e)
	{
		if (e.ctrlKey && e.altKey && e.key == 'c')
		{
			if (++this.CurrentMode > ModeTypes.Crop)
			{
				this.CurrentMode = ModeTypes.Disabled;
			}
			chrome.storage.local.set({ ExtensionModeSetting: this.CurrentMode }, function(){});
		}
	}.bind(this));
}

const UltraWideInstance = new UltraWide();

window.onload = function()
{
	chrome.storage.local.get(ExtensionModeSetting, function(Status)
	{
		UltraWideInstance.CurrentMode = Status.ExtensionMode;
		if (UltraWideInstance.ExtensionMode != ModeTypes.Disabled)
		{
			UltraWideInstance.Update();
		}
	});

	chrome.storage.onChanged.addListener(function(Changes)
	{
		UltraWideInstance.CurrentMode = Changes.ExtensionMode.newValue;
		UltraWideInstance.Update();
	});
}
