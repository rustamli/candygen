candygen :candy:  
===========

**candygen** Scriptable Static Website Generator - running on Node.js


## Installation 


```
npm install candygen -g
```


## Usage

Open `cmd` go to any folder with a website template (a folder containing `generator.xml` or `generator.json`) and run:

```
candygen
```


This will start a dev server, to stop it simply close the `cmd` window or press `Ctrl` + `C`

After the first generation, candygen will watch files for changes and will update website automatically  


```
candygen once
```
This will generate the website without starting a web server

**Specify custom port**

```
candygen port=7700
```

**Run for non-lmx static websites**
i.e. instead of using python SimpleHTTPServer

```
candygen static
```

```
candygen static port=3232
```

_arguments could be in any order_

**Download as ZIP**

- go to `/zip` to download deployable template source (with /data folder removed)
- go to `/zip-result` to download rendered website output 


**Special variables**

`_page.path` - path to page 
`_page.fullPath` - full path to page including page name
`_page.name` - page name (last part of url)

**Extras**

Add extra tools in generator.xml:

```
<extras>
  <extra name="email-tools" />
</extras>
```


## Support

Contact **turan@rustam.li** if you got any questions
