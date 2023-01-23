function onModeClick(e)
{
	if (e.target.tagName == 'INPUT')
	{
		chrome.storage.local.set({ ExtensionModeSetting: ModeTypes[e.target.id] }, function(){});
	}
}

window.onload = function()
{
	//Set ModeOptions button callbacks
	for (var i = 0; i < ModeOptions.children.length; i++)
	{
		ModeOptions.children[i].onclick = onModeClick;
	}
	
	//Get current active mode
	chrome.storage.local.get(ExtensionModeSetting, function(results)
	{
		var SelectedMode = Object.keys(ModeTypes)[results.ExtensionMode];
		for (let i = 0; i < ModeOptions.children.length; i++)
		{
			if (ModeOptions.children[i].children[0].id == SelectedMode)
			{
				ModeOptions.children[i].children[0].checked = true;
				break;
			}
		}
	});
	
	//Show help & about
	helpShow.onclick = function(e)
	{
		e.preventDefault();
		help.className = 'is-active';
	}

	helpHide.onclick = function(e)
	{
		e.preventDefault();
		help.className = null;
	}
	
	//Attribution links
	const aLinks = links.children;
	for (let i = 0; i < aLinks.length; i++)
	{
		if (aLinks[i].tagName != 'A')
		{
			aLinks[i].onclick = function()
			{
				chrome.tabs.create({ url: this.href });
			};
		}
	}
}
