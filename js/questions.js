const questions = [
    {
    round: "💍 Antigua Wedding",
    question: "What day of the week did Louise and Steve get married?",

    image: "images/quiz/happycouple.jpg",
    revealImage: "images/quiz/calendar.jpg",
    revealImageAfterAnswer: true,

    answers: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday"
        ],
        correct: 2,

        photoTitle: "💍 Wedding Day<br>9th October 1996",
        photoText: "🌴 Antigua",
        
    },
    {
        round: "💍 Antigua Wedding",
        question: "Antigua claims to have enough of what for you to enjoy a different one every day of the year?",

        image: "images/quiz/antiguamap.jpg",
        revealImage: "images/quiz/happycouplebeach.jpg",
        revealImageAfterAnswer: true,

        answers: [
            "Beaches",
            "Rum cocktails",
            "Species of fish",
            "Types of tropical fruit"
        ],
        correct: 0,
       
      
        audio: "audio/ocean.mp3",
         manualNext: true,   
      

        photoTitle: "🏖️ 365 Beaches…<br>This one was a Jolly good beach for a wedding!",
       
    },
       
{
    round: "👨‍👩‍👧 Family",
    question: "Where was this photograph taken?",

     image: "images/quiz/snow.jpg",
    revealImageAfterAnswer: true,
    revealImage: "images/quiz/frosty.jpg",
   


    answers: [
        "15 Brathay Road",
        "95 Skelwith Road",
        "99 Skelwith Road",
        "57 Thompson Hill"
    ],
    correct: 1,
    audio: "audio/frosty.mp3",
    manualNext: true,   
    photoTitle: "❄️ Snow proud of our cool new friend ☃️",
    
    showPhotoTitleAfterAnswer: true
},
   
{
    round: "👨‍👩‍👧 Family",
    
    question: "What is the name of this family cat?",

    image: "images/quiz/ziggy.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/ziggy2.jpg",
       
    answers: [
        "Shadow",
        "Bob",
        "Ziggy",
        "Garfield"
    ],

    correct: 2,   

     photoTitle: "🐈‍⬛ Ziggy Biggin",
},
   
{
    round: "👨‍👩‍👧 Family",
    question: "Which one of these photos have we NOT altered?",

    image: "images/quiz/questionphotos.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/actualphotos.jpg",
    allowPhotoComparison: true,
    
    answers: [
        
        "Summer holiday",
        "40th Birthday",
        "Family meal",
        "Well dressed couple"
    ],

    correct: 2,
    
    photoTitle: "🍴 Family meal - we've not altered that one",
        
    showPhotoTitleAfterAnswer: true,

     photoText: "📷 These are the 4 photos we started with",
    
},

{
    round: "👨‍👩‍👧 Family",
    question: "👕 We've blanked out Kai's pyjama top. What was the original design?",
    image: "images/quiz/spongebob.jpg",
    
    revealImageAfterAnswer: true,
    revealImage: "images/quiz/spongebob2.jpg",
    answers: [
        "Hotwheels",
        "SpongeBob",
        "Scooby-Doo",
        "Bart Simpson"
    ],
    correct: 1,
    audio: "audio/spongebob.mp3",
         manualNext: true,   
   photoTitle: "😄 Christmas 2006",
    
},
{ 
    round: "👨‍👩‍👧 Family",
    question: "Once upon a Birthday, Elise had a cake in the shape of...",
    image: "images/quiz/cake1.jpg",
     revealImageAfterAnswer: true,
    revealImage: "images/quiz/cake2.jpg",
    
    answers: [
        "A Princess Castle",
        "A Teddy bear",
        "Barbie",
        "Peppa Pig"
    ],
    correct: 0,
    photoTitle: "🏰 Elise's Disney Princess 4th Birthday",
    photoText: "🎂 20th September 2007" 
},
 {
    round: "👨‍👩‍👧 Family",
    
    question: "Which of these characters lived in Toyland?",

    image: "images/quiz/toyland.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/noddy.jpg",
   
    answers: [
        "Dora the Explorer",
        "Tinky Winky",
        "Noddy",
        "Postman Pat"
    ],

    correct: 2,

    audio: "audio/noddy.mp3",
    manualNext: true,   

    photoTitle: "🚗 Noddy first appeared in 1949",
    photoText: "He came out of retirement to appear on Milkshake in<br>'Make Way for Noddy' from 2002 to 2006😄",
},
{ 
    round: "👨‍👩‍👧 Family",
    question: "Which WWE superstar originally introduced this famous 'Spinner' Championship belt?",
    image: "images/quiz/belt.jpg",
    caption: "Kai 'CHAMP' Biggin 2007",
     revealImageAfterAnswer: true,
    revealImage: "images/quiz/wwe.jpg",
    
    answers: [
        "The Rock",
        "Randy Orton",
        "Triple H",
        "John Cena"
    ],
    correct: 3,

    photoTitle: "🏆 WWE created the belt for John Cena",
    photoText: "The other stars wore the same belt after him until The Rock introduced a new design in 2013" 
},
{
    round: "🏖️ Holidays",
    question: "What is a group of camels sometimes called?",
    image: "images/quiz/camels.jpg",
    smallImage: true,

revealImage: "images/quiz/camel.jpg",
 revealImageAfterAnswer: true,

    answers: [
        "A convoy",
        "A caravan",
        "A troop",
        "A parade"
    ],
    correct: 1,
    
    photoTitle: "🐪 Desert Taxi – All Aboard!",
    
},  
{
    round: "🏖️ Holidays",
    question: "What gives traditional Turkish Delight its distinctive floral flavour?",
    image: "images/quiz/turkishdelight.jpg",
    smallImage: true,

revealImage: "images/quiz/turkey.jpg",
 revealImageAfterAnswer: true,

    answers: [
        "Lavender",
        "Mint",
        "Rosewater",
        "Turkish tea"
    ],
    correct: 2,
    
    photoTitle: "🏖️ Family holiday in Turkey",
    
},  
{
        round: "🏖️ Holidays",
    question: "What is guaranteed on a British caravan holiday?",
image: "images/quiz/eastcoast.jpg",
revealImage: "images/quiz/caravan.jpg",
 revealImageAfterAnswer: true,

    answers: [
        "Wall-to-wall sunshine",
        "Peace and quiet",
        "At least one day of rain",
        "An empty beach"
        ],
        correct: 2,
    
    photoTitle: "🌞 It usually rains",
    photoText: "But not today!",
   
},  



{
     round: "📅 Guess the Year",
        question: "In which year did Louise & Steve celebrate their 'Tin' Wedding Anniversary?",
          startImage: "images/quiz/tinheart.jpg",
          smallImage: true,
          
    revealVideo: "videos/jamesbond.mp4",
    videoTitle: "🎬 Also in 2006...",
      videoText: "Daniel Craig made his debut as James Bond in Casino Royale", 
        showPhotoTitleAfterAnswer: true,

    revealImage: "images/quiz/shakennotstirred.jpg",
 
        answers: [
            "2006",
            "2011",
            "2016",
            "2021"
        ],
        correct: 0,
        
        photoTitle: "🤍 Tin Anniversary 2006",
       photoText: "🍸10 years together — Shaken, Not Stirred!",
    showPhotoTitleAfterAnswer: true
},  

{ 
    round: "📅 Guess the Year",
    
    question: "What year was Kai's first visit to Blackpool?",

    image: "images/quiz/seaside.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/seaside2.jpg",

   answers: [
            "2001",
            "2002",
            "2003",
            "2004"
        ],
        correct: 1,
       
        photoTitle: "🎡 Blackpool",
        photoText: "First visit for Kai but not for Louise and Steve",
        
    },
{ 
    round: "📅 Guess the Year",
    
    question: "What year did Elise get a Chou Chou doll for Christmas?",

    image: "images/quiz/doll.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/dolls.jpg",

   answers: [
            "2003",
            "2004",
            "2005",
            "2006"
        ],
        correct: 2,
       
        photoTitle: "🍼 Elise chose her career path early",
        photoText: "Her neo-natal training started 21 years ago 😂",
        
    },

{
 round: "🎵 Music Round",
    question: "Which blockbuster film is this music from?",
     image: "images/quiz/popcorn.jpg",
     smallImage: true,

    answers: [
        "The Lord of the Rings",
        "Gladiator",
        "Pirates of the Caribbean",
        "The Chronicles of Narnia"
    ],
    correct: 2,

    audioQuestion: "audio/blackpearl-intro.mp3",
    audioAnswer: "audio/blackpearl-answer.mp3",
    audioFull: "audio/blackpearl-full.mp3",

    revealVideo: "videos/blackpearl.mp4",
    fullRevealVideo: "videos/blackpearl-full.mp4",
    videoBeforeAnswerAudio: true,

    revealImage: "images/quiz/blackpearl.jpg",
    

    videoText: "🎬 The first Pirates of the Caribbean film, The Curse of the Black Pearl, was released in 2003",
    photoTitle: "🏴‍☠️ Shiver me timbers!",
    photoText: "Everyone stay calm. Louise and Steve are taking over this ship. Savvy?",
},
{
 round: "🎵 Music Round",
    question: "This song spent 6 weeks at No. 2 in 1991 and was re-released in 2007. Can you name the song?",
    image: "images/quiz/cd.jpg",  
    smallImage: true, 
   
    answers: [
        "Sex Bomb",
        "I'm Too Sexy",
        "SexyBack",
        "Sexy and I Know It"
    ],
    correct: 1,

    audioQuestion: "audio/fred-intro.mp3",
    audioAnswer: "audio/fred-answer.mp3",
    audioFull: "audio/fred-full.mp3",
    revealImage: "images/quiz/fred.jpg",
    revealImageAfterAnswer: true,
    photoTitle: "🎵 Right Said Fred",
    photoText: "I’m Too Sexy… and I’m not even Ten! Christmas 2008"
},
{
 round: "🎵 Music Round",
    question: "Here's one Elise used to sing. Who is this artist?",
     image: "images/quiz/ipod.jpg",   
     smallImage: true,

    answers: [
        "Rihanna",
        "Beyoncé",
        "Nelly Furtado",
        "Amerie"
    ],
    correct: 0,

    audioQuestion: "audio/umbrella-intro.mp3",
    audioAnswer: "audio/umbrella-answer.mp3",
    audioFull: "audio/umbrella-full.mp3",
    revealImage: "images/quiz/umbrella.jpg",
    revealImageAfterAnswer: true,
    photoTitle: "🏖️ Under our umbrella-ella-ella...",
},

{
    round: "✅ True or False",
    type: "truefalse",

    question: "This baby is Elise",

    image: "images/quiz/babykai.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/babyelise.jpg",
   
    answers: [
        "True",
        "False"
    ],

    correct: 1,

     photoTitle: "🧸 No it was Kai. These are Elise's baby photos",
    photoText: "🍼 Hello Elise. Welcome to the world!",
},

{
        round: "✅ True or False",
        type: "truefalse",

        question: "The Biggin family lived at 95 Skelwith Road for 8 years",

        image: "images/quiz/skelwith.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/thompson.jpg",

        answers: [
        "True",
        "False"
    ],
        correct: 0,
  
        photoTitle: "🏠 Home Sweet Home",
        photoText: "They moved to Skelwith Road in September 2002<br>and to Thompson Hill in December 2010",
        revealImageAfterAnswer: true
    },
{ 
    round: "✅ True or False",
    type: "truefalse",

    question: "This photo was taken in 2000",

    image: "images/quiz/babykai1.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/babykai2.jpg",

   answers: [
            "True",
            "False"
        ],
        correct: 1,
       
        photoTitle: "🎅 December 1999 - Kai arrived early<br>Just in time for Christmas",
        photoText: "🍼 Hello Kai. Welcome to the world!",
        
        
    },

{
    round: "🎬 What Happened Next?",
    type: "video",

    question: "Mallorca 2025 - What does Elise do next?",

    startImage: "images/quiz/ropeswing1.jpg",
    video: "videos/ropeswing-intro.mp4",
    endImage: "images/quiz/ropeswing2.jpg",

    revealVideo: "videos/ropeswing-answer.mp4",
    revealImage: "images/quiz/ropeswing3.jpg",

    photoTitle: "Elise took the plunge 💦",
        
    answers: [
        "Jumps off the rocks",
        "Rope swings into the water",
        "Is too scared to jump",
        "Dives off the rocks"
    ],

    correct: 1,
    
    explanation: "..."
},

{
    round: "❤️ Louise and Steve in 2026",
    question: "Apart from the tour guide (who isn't a Biggin) who else is the 'odd one out' in this photo?",

    image: "images/quiz/kaiadded.jpg",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/nokai.jpg",
    
    
    answers: [
        
        "Louise",
        "Steve",
        "Kai",
        "Elise"
    ],

    correct: 2,
    
    photoTitle: "🌴 Jamaica tour",
    
    showPhotoTitleAfterAnswer: true,

     photoText: "😎 Kai wasn't in the original photo.<br>We added him in!",
    
},

{
    round: "❤️ Louise and Steve in 2026",
    question: "Who were Steve and Elise meeting in this photograph?",

    image: "images/quiz/bongo.jpg",
    caption: "At the Bob Marley Museum, Kingston, Jamaica",

    revealImageAfterAnswer: true,
    revealImage: "images/quiz/bongo2.jpg",
    
    answers: [
        
        "Steel Drum Charlie",
        "Calypso Eddie",
        "Rasta Raymond",  
        "Bongo Herman",
    ],

    correct: 3,
  
    audio: "audio/jammin.mp3",
    manualNext: true,   

    photoTitle: "🥁 Herman 'Bongo Herman' Davis",
      
     photoText: "in his booth at the Bob Marley Museum where he entertains visitors, plays percussion and shares his memories of working with Bob Marley",
    
},

 {
    round: "❤️ Louise and Steve in 2026",
    question: "🤍 On 9th October 2026, how many days have Louise & Steve been married? (You may use a calculator!)",
  
    image: "images/quiz/loveheart.jpg",  
    
    revealImageAfterAnswer: true,
    revealImage: "images/quiz/lovechampagne.jpg",
  
    answers: [
        "10,950 days",
        "10,957 days",
        "10,960 days",
        "10,967 days"
    ],

    correct: 1,

    photoTitle: "🤍 30 wonderful years • 10,957 days • A lifetime of love, laughter and memories 🤍",
    photoText: "That's: 30 × 365 = 10,950, plus 7 leap days = 10,957 days!",
    
    showPhotoTitleAfterAnswer: true,
        
},
];