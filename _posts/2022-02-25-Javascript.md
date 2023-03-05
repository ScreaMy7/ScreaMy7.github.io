---
title: JS file enumeration for bug bounty hunters
date: 2022-03-3 18:00:00 -500
categories: [Bug Bounty,javascript]
tags: [JS,BB,javascript]
---

### TLDR;

1. importance of js files in bb
2. My workflow for finding js files 
3. inspecting the files
4. some reports
5. about new tool in progress and next writeup

# JS files

As bug bounty hunter, efficiently enumerating and reading JS file is an important skill ,and if you are skipping this step just because it's a tedious process you are overlooking a vital portion of your target web application. And this may be the reason you end up finding dupes on programs. If are going through same requests as other reseachers of course you will end up dupes. So to avoid dupes you need be different than others and put in more effort for high bounties. Personally some of highest bounties I have received have been from reading JS files. If you don't know much about JS analysis read [zseano blog](https://www.bugbountyhunter.com/guides/?type=javascript_files) it talks about why to search for in JS files and then come back here.


# My workflow
Reading multiple JS files which contains thousands of JS file is tedious, its just like finding needle in haystack but the rewards are quite generous. So I will be sharing my workflow about collecting and inspecting JS files. Also if you're a manual hacker like me then this is the prefered approach as you will significant amount of time.

Step 1 : Going through application 

Just browse through application , check every page within the scope. As some pages maybe be having additional JS files meant for that specific endpoint.

Step 2 : Setting the scope 

Setting the correct scope is very important, as sometimes JS files maybe stored in CDNs using CloudFront,Stackpath etc. So add correct scope as required needed to get all the JS files used by the application. 

Step 3 : Extracting JS files

I use [Uproot-js](https://github.com/0xDexter0us/uproot-JS) for extracting files. This is burp plugin which extracts and download all the JS files within scope of burp history. Huge shout out to my friend [dexter0us](https://twitter.com/0xDexter0us) for making this amazing this plugin. 

## Going in deeper
After this you should be have folder full JS files. Now open folder in any editor ,and the files are there. I personaly use VS code as it has [beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify) to beautify and it causes less strain to eyes. 

After this go breifly though all the files and mark the files which are interesting and start reading. As you gain experience you will what you will understand what to look for js files. However I am sharing some common pattern which I usually look for:

`"/` , `'/`, `/api` , `https:` -  to find more endpoints.

`POST` , `GET` , `method:` -  API calls.

`params`  -  parameters being used

`Content-Type`  -  Content type is being set by JS,so this could endpoints as well

`keys` , `token`  -  API tokens

This isn't same for all organisations, so its important to learn about the targets , rather than using `Ctrl+F` on same patterns I mentioned above.


# Some reports
Some my highest bounties have been through JS ananlysis. More this lessen my chances for duplicates, as reading JS files is a gradual process.

### High severity IDOR from email ???
One morning , I was reading a JS file of private program which had about 90k lines, I used the same workflow as I mentioned above , and found endpoint which required email of the user as  parameter , to leak confidencial data about user.
By the I reported it was already evening(JS files are tedious but rewarding)

### Info disclosure from an hidden path
On a different program I found `/rmt_stage` being mentioned in JS files.Words like this hard to bruteforce so this why JS files are a treasure to look through. However `subs.target.com/rmt_stage` had a blank response. After fuzzing I found an accessible CKFinder, which is a vunlerblity itself as it images of financial records of the company. As I spent some more time on this, I realized that there is more to it as there is a internal proxy at '/rmt_stage' which mean `sub.target.com` and `sub.target.com/rmt_stage` are two different servers. I ensured it as the `info.php` on the servers had different php versions. I ended up finding three more High bugs there ,one them included a admin panel pwn as well which is a writeup for another day :eyes: . However, the program decreased the severity of them all, so I am still salty about it. 

# Next write-up
There are still some things left to cover on JS analysis ,like how get old JS files or how to analyse JS webpacks which be next blog. it will also contain detail about a new tool which I currently working on this will further help in JS analysis. All this will be released in the next blog.

