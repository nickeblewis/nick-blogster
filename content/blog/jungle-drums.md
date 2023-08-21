---
external: false
title: "BaTidal Cycles 001 - Jungle Drums"
description: "Tidal cycles is great, just great for creating all sorts of musical patterns"
date: 2023-04-01
---

# Today's Tidal script
```haskell
-- Evaluate the first block of code first with SHIFT+ENTER
let
setbpm x = setcps (x/60/4)
_add :: Time -> Pattern a -> Pattern a -> Pattern a
_add t value pat = slow (pure $ 1+t) $ timeCat [(shift,pat),(1-shift, value)]
                where shift = 1 / (t + 1)
add :: Pattern Time -> Pattern a -> Pattern a -> Pattern a
add pt x y = innerJoin $ fmap (\t -> _add t x y) pt

-- Then evaluate this line to set BPM, try different speeds!
setbpm 160

-- Change the values here to experiment with the various effects
all $ timeLoop 4 . (rotL 4)

-- Evluate this line on it's own
all $ id

-- Evaluate the block with CTRL+ENTER
d1
$ while "t(4,16)" (|+ krush 1)
$ while "[0 | 1]*16" (superimpose (plyWith 4 (|* speed 1.25) . slow 2))
$ layer [id
    ,\x -> degradeBy (segment 16 perlin)
        $ slow 2
        $ x
        # speed 0.75
        # shape 0.1
    ,\x -> add "[0.5 | 0.25]*4" (s "jungbass:1" # speed 0.8 # shape 0.2 # krush 2)
        $ x # speed "[2 | -2]*8"
    ]
$ s "[drum drum:1 [~ drum] drum:1, drum:3*[[8 | 16]*4]]"
# krush 2

-- SHIFT+ENTER the next line to silence all audio
hush
```

Tidal Cycles is back as some people were asking about it and today’s example makes use of some cool syntax, that I am going to walk you through in a future post. Mainly because I need some time to break this example down and to then share some of the secrets behind it.

I'm going back to using NFT.UP to store my demo files on NFT.storage, it's a nice free way to share files of all kinds, audio, image, PDF and maybe even Ableton projects etc.
<audio controls>
  <source src="https://nftstorage.link/ipfs/bafybeib74ezqpy53c3sbye2zld32k3f7tsnwpbzxozko7nlcad2d7flnza" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

If you are interested in learning more about Tidal Cycles and giving it a go, the best place to go is the [official website](https://tidalcycles.org), where you can learn how to set up the main prerequisite tools. In my case I am using Supercollider, which Tidal Cycles depends on, since this application provides the audio engine itself. You'll need to install Haskell, since Tidal makes use of it's Cabal libraries. Now I know very little about Haskell other than the Tidal scriptiing language, which is easy to learn, the trickier bits are a little tricy and take some learning but there is very little to type, compared to if Tidal used Javascript for example. On top of all of these you'll need Visual Studio Code and an extension to be abl to work with Tidal Cycles. It sounds complicated but if you follow the instructions on this page, you can't go too far wrong! Link is right here https://tidalcycles.org/docs/getting-started/macos_install as you'll find a script that checks whether you have each app or not and if you've none of these it will assist you in isntalling the whole lot rather easily.

# Finding my work elsewhere online
I am on [Soundcloud](https://soundcloud.com/nickeblewis) and a lot of my work, if not nearly all of it, can be found on Soundcloud.I do have [one track](https://open.spotify.com/artist/5rmVPtGAUsJZ0cs7ae9lTU?si=fkhOUZ1OSyyuI-OSA2sLFg) at the moment on Spotify and I will grow this. I've got many more sounds stored on IPFS, which I share through blog posts like this (and [this other one](https://nicklewis.blog/posts/ipfs/)).