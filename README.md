# botpress-web

<img src="https://rawgit.com/botpress/botpress-web/next/assets/webview_convo.png" height="200px" />

Official Webchat connector module for [Botpress](http://github.com/botpress/botpress).

This module has been build to accelerate and facilitate development of Messenger bots.

## How to install it

**Important:** You will need to run the development botpress branch (`next`) in order for this demo to work. The reason is because the fullscreen features is unreleased yet.

- Compile botpress on branch `next`
- `npm link ../path/to/botpress` in your bot
- Run your bot and navigate to the `botpress-web` module interface
- Append the `viewMode=3` to the URL query to put it in fullscreen

## How to use it

You can use it a the same way you use **botpress-messenger** and **botpress-slack** or any other connector. The way of coding it remains the same, so you should use to code the interactions:

- [UMM](https://botpress.io/docs/foundamentals/umm.html)
- Flows (https://botpress.io/docs/foundamentals/flow.html).

> **Note on Views**
> 
> You can talk to it and use it in different views (mobile, web, embedded), see section below to have the detail.

#### Supported messages

- Text messages

<img src="https://rawgit.com/botpress/botpress-web/next/assets/mobile_view.png" height="200px" />

- Quick replies

<img src="https://rawgit.com/botpress/botpress-web/next/assets/quick_replies.png" height="200px" />

- Caroussel *(soon)*
- Image *(soon)*
- Video *(soon)*
- Audio *(soon)*

## Supported views

### Mobile view

When your bot is running, you can have access to a mobile view at **${HOSTNAME}/lite/?m=web&v=fullscreen** *(e.g http://localhost:3000/lite/?m=web&v=fullscreen)*.

This **URL** is public so you can share it we other people, so they can try and talk with your bot.

<img src="https://rawgit.com/botpress/botpress-web/next/assets/mobile_view.png" height="200px" />

### Web view (in the interface)

The webchat is really useful to test and develop your bot. You won't have to connect your bot to any platform. You can access and test it directly in the UI of Botpress. When `botpress-web` is installed, it's automatically added to the plugins of your bot.

<img src="https://rawgit.com/botpress/botpress-web/next/assets/webview_side.png" height="200px" />

### Web view (on external website)

To embedded the web interface to an existing website, you simply need to add this `script` at the end of your `<body>`. Don't forget to set the `hostname` correctly to match the **URL** of your bot.

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

### Pro Version
- Make the chat style customizable (pro version, ask @Sylvain about this)

## Caveats

- If you're running the bot in NODE_ENV=production, the module will prompt a login screen. We solved this situation in Botpress Pro (ask @Sylvain about this). To run this in production you essentially need a Pro version due to technical limitations regarding authentication & UI.

## Credits

Thanks to James Campbell for the original code of the Web Interface (code from Bottr)!
