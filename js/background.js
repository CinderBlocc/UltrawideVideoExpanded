chrome.runtime.onInstalled.addListener(function (details)
{
	if (details.reason == 'update')
	{
		var NotificationOptions =
		{
			type: 'basic',
			iconUrl: "images/icon.png",
			title: "Ultrawide Video updated",
			message: "Update log: Version " + chrome.runtime.getManifest().version + " removed FORCE modes"
		};

		chrome.notifications.create(null, NotificationOptions, function(updateNotificationId)
		{
			chrome.notifications.onClicked.addListener(function(notificationId)
			{
				if (notificationId === updateNotificationId)
				{
					chrome.tabs.create({ url:"https://github.com/wltrsjames/Ultrawide-Video" });
					chrome.notifications.clear(updateNotificationId);
				}
			});
		});
	}

	chrome.storage.local.set({ ExtensionModeSetting: ModeTypes.Disabled });
});