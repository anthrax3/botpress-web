# botpress-web

## How to run this

**Important:** You will need to run the development botpress branch (`next`) in order for this demo to work. The reason is because the fullscreen features is unreleased yet.

- Compile botpress on branch `next`
- `npm link ../path/to/botpress` in your bot
- Run your bot and navigate to the `botpress-web` module interface
- Append the `viewMode=3` to the URL query to put it in fullscreen


## Mobile view

When your bot is running, you can have access to a mobile view at **${HOSTNAME}/lite/?m=web&v=fullscreen** *(e.g http://localhost:3000/lite/?m=web&v=fullscreen)*.

This URL is public so you can share it we other people, so they can try and talk with your bot.

## Web view (in the interface)



## Web view (on external website)

```
<script>
  window.botpressSettings = {
    hostname: "botpress.pagekite.me" // <<-- Change this to your bot hostname
  };
  </script>
  <script>
  !function(){function t(){var t=n.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://"+a.hostname+"/api/botpress-web/inject.js";var e=n.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}var e=window,a=e.botpressSettings,n=document;e.attachEvent?e.attachEvent("onload",t):e.addEventListener("load",t,!1)}();
  </script>
```

## TODO

- Users are currently all anonymous / unauthenticated / unidentified
- This works only with one user (the bot currently broadcasts to all users)
- Change the background
- Fix the File Selector
- Handle File Uploads
- Handle typing indicator

### Pro Version
- Make the chat style customizable (pro version, ask @Sylvain about this)

## Caveats

- If you're running the bot in NODE_ENV=production, the module will prompt a login screen. We solved this situation in Botpress Pro (ask @Sylvain about this). To run this in production you essentially need a Pro version due to technical limitations regarding authentication & UI.

## Credits

Thanks to James Campbell for the original code of the Web Interface (code from Bottr)!
