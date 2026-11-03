import { Question, Category } from '../types';

export const QUESTIONS: Question[] = [
  // ==========================================
  // CATEGORY 1: FAKE NEWS (10 Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'fn-01',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'dailybuzzbreaking-247.co.uk.net',
    scenarioContent: '🚨 SHOCKING: Government Secretly Bans All Homework Nationwide Starting Monday!',
    question: 'Should you trust this headline before seeing it on an official school or news site?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Look at the weird web address (.co.uk.net) and all-caps clickbait words!',
    explanation: 'Fake news sites use shocking all-caps headlines and weird stacked web domains (.co.uk.net) to fool people into clicking. Never trust or share without verifying.',
    mediaLiteracyTip: 'Check the URL! If a site has a bizarre web address and no official confirmation, it is fake.'
  },
  {
    id: 'fn-02',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'ViralHealthFeed',
    scenarioContent: '"Scientists confirm eating 3 candy bars daily boosts math test scores by 85%!" (Study paid for by ChocoBite Candy Company)',
    question: 'Should you trust this as unbiased, objective science?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'The candy company paid for the study praising their own candy!',
    explanation: 'When a commercial brand funds a study that praises its own product, there is an obvious conflict of interest to twist or exaggerate the data.',
    mediaLiteracyTip: 'Always check who funded the study! If the maker of the product paid for the research, be skeptical.'
  },
  {
    id: 'fn-03',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'MetroTimesOnline',
    scenarioContent: 'A photo of a flooded airport from a 2018 typhoon is posted today saying: "Our local airport is completely underwater this morning!"',
    question: 'Is taking an old photo and reposting it with a fake date considered misinformation?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The photo is 100% real, but the date and location are completely fake!',
    explanation: 'Yes! "False context" is one of the most common tricks online. The photo is real, but attaching a fake caption or date tricks people.',
    mediaLiteracyTip: 'A photo can be real while the caption is a total lie. Use reverse image search to find when it was first posted.'
  },
  {
    id: 'fn-04',
    category: 'FAKE_NEWS',
    scenarioType: 'social_post',
    scenarioSource: '@WorldNewsAlerts_1984',
    scenarioContent: 'BREAKING: A massive 500-foot tidal wave just destroyed the coast! (No links, photo is taken from a Hollywood disaster movie).',
    question: 'If a massive global disaster really happened, would major international news wires report it immediately?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'A huge real disaster would be on every TV channel and news site worldwide.',
    explanation: 'Yes. If a genuine catastrophe occurred, every news station, government agency, and emergency service would be broadcasting it live.',
    mediaLiteracyTip: 'Practice lateral reading: If only one random social media account is screaming about a disaster, it is almost certainly fake.'
  },
  {
    id: 'fn-05',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'GlobalBuzzReport.xyz',
    scenarioContent: 'Article says: "Top anonymous insiders report that all schools in the country will close permanently next month!" (No author byline, no date, no named sources).',
    question: 'Is an article with no author name and zero real sources trustworthy?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'No reporter name, no real sources, just vague "anonymous insiders".',
    explanation: 'No. Credible journalism names the author and transparently cites verifiable sources so readers can check the facts for themselves.',
    mediaLiteracyTip: 'If an article conceals who wrote it and cites only vague "insiders", treat it as rumor, not news.'
  },
  {
    id: 'fn-06',
    category: 'FAKE_NEWS',
    scenarioType: 'social_post',
    scenarioSource: 'TrendWireNow',
    scenarioContent: 'A meme puts an inspiring quote next to a photo of Albert Einstein, but gives no book, date, or speech reference.',
    question: 'Does having a famous person\'s picture next to a quote prove they actually said it?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Anyone can paste words onto a picture of a famous person in 5 seconds!',
    explanation: 'No. Fake quotes are everywhere online because adding a famous historical face makes quotes look believable without any real evidence.',
    mediaLiteracyTip: 'Memes are not history books! Look up famous quotes on Wikiquote to see if there is an authentic transcript.'
  },
  {
    id: 'fn-07',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'The Daily Chronicle Feed',
    scenarioContent: 'Headline: "MAYOR CAUGHT STEALING $10M!" Inside the article: The mayor simply attended a public council meeting about road repairs.',
    question: 'Is it safe to share an online article after only reading the shocking headline?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'The headline accused the mayor of a crime, but the article text proved it was totally false!',
    explanation: 'No! Over 60% of people share links without reading past the headline. Clickbait headlines frequently exaggerate or contradict the actual story.',
    mediaLiteracyTip: 'Read before you share! Headlines are written to bait clicks, not always to summarize the truth.'
  },
  {
    id: 'fn-08',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'TechPulseDaily',
    scenarioContent: 'Viral post claims: "A cosmic solar flare will permanently shut down 99% of all smartphones on Friday!"',
    question: 'Should you believe a terrifying claim that has zero official alerts from NASA or phone companies?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'A real worldwide tech collapse would trigger emergency alerts from governments and phone makers.',
    explanation: 'No. Extraordinary claims require extraordinary evidence. A threat to all phones would be announced by national emergency regulators and space agencies.',
    mediaLiteracyTip: 'The bigger and scarier a claim is, the more independent official proof must exist.'
  },
  {
    id: 'fn-09',
    category: 'FAKE_NEWS',
    scenarioType: 'social_post',
    scenarioSource: 'SatireTimes.com',
    scenarioContent: '"Local Dog Elected as City Council Mayor; Promises Free Tennis Balls and Bacon for All Citizens."',
    question: 'Can comedy satire stories accidentally fool people who don\'t check the publisher?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Satire accounts make funny joke stories, but careless readers often take them seriously!',
    explanation: 'Yes! Satire and parody sites write jokes for entertainment, but people scrolling quickly often think they are real news.',
    mediaLiteracyTip: 'Always check if the account is a known comedy or parody page before reacting in the comments.'
  },
  {
    id: 'fn-10',
    category: 'FAKE_NEWS',
    scenarioType: 'headline',
    scenarioSource: 'HealthBreakthroughToday.net',
    scenarioContent: '"Doctors hate this one kitchen vegetable that completely cures all seasonal colds and flus in 10 seconds!"',
    question: 'Is an ad claiming a "secret miracle cure that doctors want to hide" a red flag?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Phrases like "doctors hate this" and "cures everything in seconds" are classic scam phrases.',
    explanation: 'Yes. Fraudulent health websites use conspiracy framing ("doctors want to hide this") to sell unproven supplements or harvest click revenue.',
    mediaLiteracyTip: 'Real medical discoveries are published in medical journals, not promoted by sketchy clickbait ads.'
  },

  // ==========================================
  // CATEGORY 2: FAKE PRODUCTS (10 Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'fp-01',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'HyperSmartDeals-Mall.shop',
    scenarioContent: 'Brand new latest $1,200 smartphone on sale for just $19.99! "Only 2 left! Countdown: 03:59!"',
    question: 'Is a brand new $1,200 smartphone being sold for $19 a legitimate deal?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'A 98% discount on an expensive luxury phone with a panic timer is a guaranteed scam!',
    explanation: 'No. Scammers use impossible 95%+ discounts and artificial countdown timers to panic you into typing your card number.',
    mediaLiteracyTip: 'Golden rule: If a deal looks too good to be true, it is 100% a scam.'
  },
  {
    id: 'fp-02',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'BioQuantumSlim.biz',
    scenarioContent: '"Quantum Resonance Ring: Wear this ring to burn 2,000 calories while sleeping with zero exercise or diet!"',
    question: 'Can wearing a metal ring on your finger physically burn thousands of calories without moving?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'A ring cannot violate human biology or the laws of physics!',
    explanation: 'No. A piece of jewelry cannot burn body calories. Scammers use words like "quantum" and "resonance" to sound scientific.',
    mediaLiteracyTip: 'Be alert to fake science buzzwords. Shiny jewelry cannot burn body calories.'
  },
  {
    id: 'fp-03',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'DirectShop App',
    scenarioContent: 'A product has 500 reviews, all rated exactly 5 stars, all posted on the exact same afternoon with identical sentences like "Best item good product."',
    question: 'Are hundreds of identical 5-star reviews posted at the same time a sign of fake bot reviews?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Real buyers review on different days with different words, not 500 identical comments in one hour!',
    explanation: 'Yes! Sellers buy packages of fake bot reviews that get posted in batches. Identical wording and timestamps are dead giveaways.',
    mediaLiteracyTip: 'Check 2, 3, and 4-star reviews! Real customers who actually used the product give honest feedback there.'
  },
  {
    id: 'fp-04',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'SneakerVault-KicksOnline.cc',
    scenarioContent: 'Limited sneakers for $40. The seller states: "Payment accepted ONLY via Apple/Amazon gift cards. Credit cards not accepted."',
    question: 'Should you ever pay for online purchases using retail gift cards?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Gift card codes are untraceable and cannot be refunded when you get scammed!',
    explanation: 'No! Scammers demand gift cards because the money is untraceable and cannot be reversed or refunded by your bank.',
    mediaLiteracyTip: 'Never buy goods using retail gift cards or money wires. Legitimate businesses accept secure credit/debit cards.'
  },
  {
    id: 'fp-05',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'SocialAd Apparel Store',
    scenarioContent: 'A random social media ad sells a $15 jacket using a photo stolen directly from a luxury fashion runway show in Paris.',
    question: 'Can reverse image search help you spot if a seller stole their photos from an expensive brand?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Reverse image search shows where the photo was originally published on the web!',
    explanation: 'Yes! Right-clicking an image and searching with Google Images reveals if the photos were stolen from a designer or artist.',
    mediaLiteracyTip: 'Search the product image with Google Lens before buying from unknown social media ads.'
  },
  {
    id: 'fp-06',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'GlowPure Cosmetics Online',
    scenarioContent: 'A skincare cream displays a badge: "Certified by the International Dermatology Safety Board" (a made-up organization that does not exist).',
    question: 'Do scam websites invent fake safety badges and organizations to trick buyers?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Anyone can draw a gold seal and invent an official-sounding name!',
    explanation: 'Yes. Fraudulent websites regularly invent official-sounding councils and safety bureaus to stick onto untested products.',
    mediaLiteracyTip: 'Google the name of the certification body. If it doesn\'t exist outside the seller\'s site, the badge is fake.'
  },
  {
    id: 'fp-07',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'TechGadgetDropship.co',
    scenarioContent: 'An ad claims a pocket-sized electric heater the size of a tea cup can heat an entire 3-story house in 2 minutes for 1 cent.',
    question: 'Does this tiny heater\'s claim violate the laws of physics?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'A tiny 50-watt plug cannot generate the heat of a 5,000-watt central heating furnace!',
    explanation: 'Yes. Energy cannot be created out of thin air. A tiny battery or wall plug device cannot heat an entire house in minutes.',
    mediaLiteracyTip: 'Basic school science applies online: Marketing videos cannot bend the laws of energy.'
  },
  {
    id: 'fp-08',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'QuickGameKeys-Instant.xyz',
    scenarioContent: 'A website sells video game codes for 90% off. The site has no company name, no address, no customer service phone, and no email.',
    question: 'Should you enter your payment details on a site with zero contact or company information?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'If they take your money and don\'t send the game, you have zero way to contact them!',
    explanation: 'No! Shady storefronts pop up for a few weeks to steal money, then shut down overnight with zero trace.',
    mediaLiteracyTip: 'Always check the Contact page for a real company address and customer service before paying.'
  },
  {
    id: 'fp-09',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'PureSleepWellness.net',
    scenarioContent: 'A social video shows a celebrity praising a dietary supplement, but their lips look blurry and their speech sounds slightly robotic.',
    question: 'Could this celebrity video be an unauthorized AI deepfake?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'AI voice clones and lip-sync tools are frequently used to fake celebrity ads!',
    explanation: 'Yes! Scammers take real clips of famous celebrities and use AI to replace their voice and lip movements to endorse scam products.',
    mediaLiteracyTip: 'Check the celebrity\'s verified social account. If they aren\'t posting it there, the video ad is almost certainly a deepfake.'
  },
  {
    id: 'fp-10',
    category: 'FAKE_PRODUCTS',
    scenarioType: 'product',
    scenarioSource: 'DailyApparelMegaStore.com',
    scenarioContent: 'During checkout for a $10 t-shirt, a pre-checked box signs you up for a recurring $69/month "VIP membership fee".',
    question: 'Is hiding a monthly subscription inside a pre-checked box an example of a shady "dark pattern"?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The store tries to trick you into monthly charges without you noticing!',
    explanation: 'Yes! "Dark patterns" are sneaky website designs created to trick shoppers into recurring fees, hidden charges, or data sharing.',
    mediaLiteracyTip: 'Always review the final checkout total and uncheck hidden subscription boxes before paying.'
  },

  // ==========================================
  // CATEGORY 3: RUMOURS & GOSSIP (10 Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'rg-01',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Class WhatsApp Group',
    scenarioContent: '"Guys! My cousin\'s friend knows someone on the school board who said exams are cancelled forever!"',
    question: 'Should you believe a "friend of a friend" rumour without official school confirmation?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Notice the chain: cousin → friend → someone else. Classic playground rumor!',
    explanation: 'No. Hearsay chains ("friend of a friend") constantly exaggerate or fabricate stories like a game of telephone. Wait for official news.',
    mediaLiteracyTip: 'Always trace claims back to the primary source: If school rules change, the school sends an official letter.'
  },
  {
    id: 'rg-02',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Discord Channel',
    scenarioContent: 'A screenshot shows a classmate allegedly sending a nasty message in chat, but the font looks slightly weird.',
    question: 'Can convincing fake chat screenshots be created in seconds using free online generators?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Free websites let anyone make fake WhatsApp, Discord, or Instagram screenshots in 30 seconds!',
    explanation: 'Yes! Anyone can make fake chat screenshots with any name and text they want. Never treat a screenshot as absolute proof.',
    mediaLiteracyTip: 'Screenshots are easily forged. Never forward chat screenshots that could ruin someone\'s reputation.'
  },
  {
    id: 'rg-03',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'social_post',
    scenarioSource: 'TikTok Gossip Reel',
    scenarioContent: '"R.I.P. to our favourite singer who tragically passed away 2 hours ago! 💔🕊️" (Thousands of sad comments, but zero news reports exist).',
    question: 'Do viral accounts invent celebrity death hoaxes just to farm views and comments?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'If a massive star passed away, it would be the #1 headline on news sites worldwide!',
    explanation: 'Yes! Accounts post fake death rumors because sad people quickly comment and share, boosting the account\'s views.',
    mediaLiteracyTip: 'If a famous person really dies, it will be on BBC, AP, and CNN within minutes. Check news outlets before mourning in comments.'
  },
  {
    id: 'rg-04',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Student Group Chat',
    scenarioContent: 'Someone forwards a private, hurtful rumor about a classmate and asks everyone in the chat to pass it on.',
    question: 'Can you stop the spread of a harmful rumor simply by refusing to forward it?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Rumours only spread when people forward them. You have the power to break the chain!',
    explanation: 'Yes! You are the circuit breaker. If you don\'t forward it, the rumor dies with you and protects an innocent person.',
    mediaLiteracyTip: 'Be the circuit breaker! You have the power to stop gossip in its tracks.'
  },
  {
    id: 'rg-05',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'social_post',
    scenarioSource: 'Instagram Story Feed',
    scenarioContent: '"Instagram updates their rules tomorrow! All your private deleted photos become public unless you repost this exact text right now!"',
    question: 'Does reposting a chain-letter text to your social story give you any legal rights?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'This copy-paste chain letter has been around for 15 years and is 100% fake!',
    explanation: 'No! Copy-paste chain letters have zero legal standing. Real app updates are sent through official settings menus or account emails.',
    mediaLiteracyTip: 'Apps don\'t change terms through chain-letters. Reposting text gives you zero legal protection.'
  },
  {
    id: 'rg-06',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Gaming Clan Chat',
    scenarioContent: '"If you type your password backwards into the clan chat, the game server automatically censors it as stars! Try it!"',
    question: 'Is this an account theft trick designed to steal your game password?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'When you type your password backwards, the scammer just reads it and reverses the letters!',
    explanation: 'Yes! This is an ancient gaming scam. The chat does NOT censor it, and the scammer simply reverses your letters to steal your account.',
    mediaLiteracyTip: 'NEVER type your password into a public chat for any reason, forwards or backwards.'
  },
  {
    id: 'rg-07',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'social_post',
    scenarioSource: 'Campus Gossip Page',
    scenarioContent: 'An anonymous account posts: "Someone told us that the cafeteria food is poisoned!" (Zero photos, zero evidence cited).',
    question: 'Is an anonymous social post with zero proof enough evidence to believe a serious claim?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Anyone can type an anonymous lie on the internet with zero accountability!',
    explanation: 'No. Anonymous gossip accounts post claims without evidence to stir up drama. Real health violations are documented by health inspectors.',
    mediaLiteracyTip: 'Proof requires evidence. "Someone said" is not proof that something happened.'
  },
  {
    id: 'rg-08',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Family Messaging Group',
    scenarioContent: 'An urgent voice note forwarded 1,000 times features a panicked speaker claiming city tap water will be turned off in 20 minutes.',
    question: 'Does a panicked tone of voice prove that a voice note is telling the truth?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Panic and drama are used on purpose to stop you from thinking clearly!',
    explanation: 'No. Emotional tone and panicked voices bypass our critical thinking. Genuine citywide utility outages are posted on utility websites.',
    mediaLiteracyTip: 'If a forwarded voice note causes panic, check the official municipal city website before freaking out.'
  },
  {
    id: 'rg-09',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'social_post',
    scenarioSource: 'Fandom Social Space',
    scenarioContent: 'Fans claim two popular actors are having a massive fight because one didn\'t "like" the other\'s photo within 15 minutes.',
    question: 'Is jumping to dramatic conclusions from tiny online coincidences a mistake?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Maybe they were eating lunch or had a dead battery instead of a giant feud!',
    explanation: 'Yes! People love drama and connect random unrelated dots to invent elaborate feuds when simple explanations are usually the truth.',
    mediaLiteracyTip: 'The simplest explanation is usually right: People aren\'t on their phones 24 hours a day.'
  },
  {
    id: 'rg-10',
    category: 'RUMOURS_GOSSIP',
    scenarioType: 'chat',
    scenarioSource: 'Neighbourhood Chat',
    scenarioContent: 'A post warns neighbours: "A white delivery van was parked down the street for 15 minutes! They must be planning burglaries!"',
    question: 'Can spreading panic over delivery drivers taking a lunch break harm innocent people?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Delivery couriers park on streets every day to take lunch or sort parcels!',
    explanation: 'Yes. Unfounded neighborhood alert posts turn ordinary workers into criminal suspects, creating unwarranted fear and harassment.',
    mediaLiteracyTip: 'Pause and ask: Is there actual suspicious activity, or just a worker doing their daily job?'
  },

  // ==========================================
  // CATEGORY 4: RAGEBAIT (10 Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'rb-01',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: '@HotTakeZone',
    scenarioContent: '"All teenagers are completely lazy and shouldn\'t get weekends off! Reply if you\'re mad!"',
    question: 'Was this post written deliberately to make you angry so you reply?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The poster explicitly says "Reply if you\'re mad!" to farm comment interactions!',
    explanation: 'Yes! Social media algorithms reward angry comments just like thumbs-up likes. The creator posts insulting nonsense to boost their ad money.',
    mediaLiteracyTip: 'Don\'t feed the trolls! Leaving an angry comment gives the creator exactly what they want: more views.'
  },
  {
    id: 'rb-02',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: 'ViralFoodHacks',
    scenarioContent: 'A video shows someone dumping an entire jar of mayonnaise, raw noodles, and candy into a toaster, calling it "Authentic Italian Pasta."',
    question: 'Do creators deliberately waste food because outrage brings millions of views and money?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'They waste food on purpose so millions of people comment "This is disgusting!"',
    explanation: 'Yes! "Rage cooking" channels make repulsive recipes on purpose because thousands of outraged comments push the video into trending feeds.',
    mediaLiteracyTip: 'If a cooking video looks absurd and wasteful, it was staged to steal your attention.'
  },
  {
    id: 'rb-03',
    category: 'RAGEBAIT',
    scenarioType: 'headline',
    scenarioSource: 'ClickDebateMedia',
    scenarioContent: 'Headline: "Generation Z is destroying the universe by refusing to buy paper napkins!"',
    question: 'Is blaming an entire age group a classic trick to start comment wars between generations?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Pitting young vs old creates massive arguments in the comment section!',
    explanation: 'Yes! "Us vs. Them" generational battles get thousands of defensive comments from both sides, guaranteeing high ad revenue.',
    mediaLiteracyTip: 'Whenever a headline says "All people of Group X are ruining Y", it is selling outrage, not real news.'
  },
  {
    id: 'rb-04',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: '@DebateDailyFeed',
    scenarioContent: 'A 5-second video cuts a speaker off mid-sentence: "...we should close all parks..." The full speech was: "...I disagree with those who say we should close all parks..."',
    question: 'Can cutting a video clip out of context totally flip what the speaker meant?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Cutting out the first 4 words made them look like they said the exact opposite!',
    explanation: 'Yes! Video clippers cut out context to manufacture scandals and outrage against things the speaker never actually believed.',
    mediaLiteracyTip: 'When a clip is suspiciously short (under 10 seconds), search for the uncut full speech.'
  },
  {
    id: 'rb-05',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: 'TrendHunter_Viral',
    scenarioContent: '"Like if you love puppies! Keep scrolling if you want innocent puppies to suffer forever!"',
    question: 'Should you feel guilty for scrolling past manipulative guilt-bait posts?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Scrolling past a social post has zero effect on real animals in the real world!',
    explanation: 'No! Emotional guilt-traps are designed to extract quick likes. Scrolling past a digital post has zero real-world impact on puppies.',
    mediaLiteracyTip: 'Scroll past emotional guilt-traps without a second thought.'
  },
  {
    id: 'rb-06',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: 'StreetInterviewClips',
    scenarioContent: 'A street interviewer talks to 40 people, but only airs the 2 people who gave silly, wrong answers, titling the video: "Are citizens totally clueless?!"',
    question: 'Does editing out all the smart answers create a fake impression of how people think?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'They cut out 38 intelligent answers and showed only the funny mistakes!',
    explanation: 'Yes! Creators film dozens of passers-by and throw away all the normal answers, broadcasting only the goofy ones to make a group look foolish.',
    mediaLiteracyTip: 'Street interview videos are comedy skits, not real scientific polling.'
  },
  {
    id: 'rb-07',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: '@OpinionWarsGlobal',
    scenarioContent: '"If you don\'t wake up at 3:00 AM every day and run 15 km, you have zero discipline and will fail in life."',
    question: 'Is rude, insulting advice usually posted just to bait defensive arguments in the comments?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Insulting your audience is a classic way to make them angrily reply!',
    explanation: 'Yes! Extreme, arrogant advice is crafted so hundreds of people comment: "This is unhealthy!" The creator gets free viral engagement.',
    mediaLiteracyTip: 'Real advice is encouraging and realistic. If advice is delivered as an insult, it is ragebait.'
  },
  {
    id: 'rb-08',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: 'DramaAlert_Unfiltered',
    scenarioContent: 'Headline screams: "TOTAL WAR ERUPTS! CAREERS OBLITERATED FOREVER!" (Two influencers simply unfollowed each other on Instagram).',
    question: 'Is using extreme war words for tiny social media drama an exaggeration trick?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Using words like "WAR" and "OBLITERATED" for an unfollow is dramatic clickbait!',
    explanation: 'Yes! Catastrophizing tiny everyday events tricks casual scrollers into thinking a major crisis has occurred.',
    mediaLiteracyTip: 'Strip away the dramatic adjectives and look at the bare facts: An unfollow is not a war.'
  },
  {
    id: 'rb-09',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: 'GamingDiscourseHub',
    scenarioContent: 'Meme post says: "The original Super Mario Bros was released on the PlayStation 5 in 1980!"',
    question: 'Do meme accounts post obvious mistakes on purpose so hundreds of people rush to correct them?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'People love correcting typos and mistakes in the comment section!',
    explanation: 'Yes! Known as "Cunningham\'s Law", posting silly errors makes thousands of people comment to correct the poster, boosting the post.',
    mediaLiteracyTip: 'When you see a ridiculous typo on a big meme page, it wasn\'t an accident—it was bait.'
  },
  {
    id: 'rb-10',
    category: 'RAGEBAIT',
    scenarioType: 'social_post',
    scenarioSource: '@ViralCultureBait',
    scenarioContent: 'A video shows someone deliberately dropping a brand new $1,000 smartphone into a river while grinning at the camera.',
    question: 'Does leaving an angry comment actually help the creator get more video views and ad money?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The algorithm counts your angry comment as engagement and shows the video to more people!',
    explanation: 'Yes! The only thing creators care about is engagement. An angry comment tells the algorithm the video is interesting, boosting its reach.',
    mediaLiteracyTip: 'Your attention is valuable. Tap "Not Interested" or block wasteful creators instead of replying.'
  },

  // ==========================================
  // CATEGORY 5: FACT CHECK (10 Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'fc-01',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Digital Detective Toolkit',
    scenarioContent: 'You see a photo of an impossible bright neon purple waterfall claimed to be a new natural wonder in a forest.',
    question: 'Can reverse image search help you find the original, unedited photo?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Tools like Google Lens and TinEye find matching images across the entire internet!',
    explanation: 'Yes! Reverse image search indexes millions of photos and can show you the original blue water photo before someone tinted it purple.',
    mediaLiteracyTip: 'Reverse image search is a digital detective\'s superpower. It reveals where a photo came from.'
  },
  {
    id: 'fc-02',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Stanford History Education Group Guide',
    scenarioContent: 'A student lands on a new website called "SaveThePlanetsNow.org" that has a very clean, professional logo.',
    question: 'Should you open new browser tabs to check what trusted outside sources say about an unfamiliar site?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'This is called "Lateral Reading"—checking across tabs instead of just reading down the page!',
    explanation: 'Yes! Pro fact-checkers open new tabs to search who owns and funds a site, rather than trusting the site\'s own "About Us" page.',
    mediaLiteracyTip: 'Don\'t read vertically (down the page); read laterally (across tabs) to check credibility.'
  },
  {
    id: 'fc-03',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Source Evaluation Checklist',
    scenarioContent: 'You are researching whether a new sports helmet prevents injuries.',
    question: 'Is a sponsored TikTok influencer review more scientifically reliable than an independent testing lab report?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'The influencer was paid free gear; the independent lab did real scientific crash tests!',
    explanation: 'No! Independent laboratory testing and peer-reviewed medicine journals test equipment scientifically without promotional bias.',
    mediaLiteracyTip: 'Look for independent testing and scientific peer review over paid influencer endorsements.'
  },
  {
    id: 'fc-04',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Domain Investigation Unit',
    scenarioContent: 'You get a text message: "Package delivery failed! Update your address at: royalpost-dispatch-secure.top/login"',
    question: 'Is a weird web ending like ".top" instead of an official postal service domain a sign of phishing?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Official mail services use legitimate domains like .com or .gov, not cheap .top domains!',
    explanation: 'Yes! Scammers buy cheap domains like .top or .xyz and put official-sounding words in the front to fool mobile users.',
    mediaLiteracyTip: 'Check the domain ending right before the slash! Official services don\'t use .top or .cc domains.'
  },
  {
    id: 'fc-05',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'AI Verification Protocol',
    scenarioContent: 'A photo shows a crowd. When you zoom in on their hands, several people have 6 fingers, fused sunglasses, and scrambled sign text.',
    question: 'Are deformed hands and scrambled lettering common visual signs of AI-generated images?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'AI image generators still struggle with drawing hands, teeth, and real written words!',
    explanation: 'Yes! AI image models frequently hallucinate anatomical errors like 6 fingers, melted glasses, and unreadable alien sign lettering.',
    mediaLiteracyTip: 'Spotting AI: Zoom in on hands, teeth, reflections in eyes, and background text.'
  },
  {
    id: 'fc-06',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Web Archive Inspection',
    scenarioContent: 'An online storefront claims: "Proudly serving online shoppers since 2010!" You suspect the site was created 3 weeks ago.',
    question: 'Can the Wayback Machine (Internet Archive - web.archive.org) show you historical snapshots of websites from past years?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The Internet Archive saves snapshots of billions of web pages over the last 25 years!',
    explanation: 'Yes! The Wayback Machine preserves historical web snapshots. If a site claiming to exist since 2010 has zero history before last month, it\'s lying.',
    mediaLiteracyTip: 'Use web.archive.org to verify the true age and history of suspicious shopping sites.'
  },
  {
    id: 'fc-07',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'IFCN Fact Check Database',
    scenarioContent: 'You want to check if a viral political rumour has already been investigated and debunked by professional journalists.',
    question: 'Do certified fact-checking organizations (like Snopes or Full Fact) show their sources step-by-step?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Accredited fact-checkers show all their links and documents so you can verify their work!',
    explanation: 'Yes! Accredited fact-checkers adhere to strict codes of transparency: they link all original sources and show their work step-by-step.',
    mediaLiteracyTip: 'Reputable fact-checkers show their work so you can independently verify their findings.'
  },
  {
    id: 'fc-08',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Geolocation Intelligence',
    scenarioContent: 'A viral video claims to show a protest in Paris yesterday, but all the road signs are in Spanish and cars drive on the left.',
    question: 'Can background environmental clues like road markings and street signs prove where a video was really filmed?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Street signs, language, license plates, and electrical plugs give away the true location!',
    explanation: 'Yes! Geolocation investigators look at street signs, road markings, architecture, and languages to pinpoint exact filming coordinates.',
    mediaLiteracyTip: 'Look at the background! Details like road signs and car license plates immediately debunk fake location claims.'
  },
  {
    id: 'fc-09',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Statistical Literacy Unit',
    scenarioContent: 'A headline screams: "Crime in town has jumped by an astronomical 100%!" (In reality, crimes went from 1 incident to 2 incidents in the whole year).',
    question: 'Can percentage increases sound way scarier when the raw baseline numbers are hidden?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Going from 1 to 2 is technically a 100% jump, but it\'s only one single extra incident!',
    explanation: 'Yes! Using percentages without showing the raw numbers is a classic media scare tactic to make tiny changes sound catastrophic.',
    mediaLiteracyTip: 'Always demand the raw numbers! Ask: "A percentage increase from what initial number?"'
  },
  {
    id: 'fc-10',
    category: 'FACT_CHECK',
    scenarioType: 'search',
    scenarioSource: 'Media Literacy Core Competency',
    scenarioContent: 'You feel a sudden rush of intense panic or fury immediately after reading a shocking post in your feed.',
    question: 'Should you PAUSE and verify before immediately hitting the share button?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'The "SIFT" method begins with S: STOP and pause when you feel strong emotions!',
    explanation: 'Yes! When you feel strong emotions, critical thinking slows down. Taking 10 seconds to stop and verify prevents spreading false panic.',
    mediaLiteracyTip: 'Remember SIFT: Stop, Investigate the source, Find trusted coverage, Trace claims back to original context.'
  },

  // ==========================================
  // CATEGORY 6: MYSTERY ROUND (8 Challenge Questions - Fast YES/NO)
  // ==========================================
  {
    id: 'mr-01',
    category: 'MYSTERY_ROUND',
    scenarioType: 'social_post',
    scenarioSource: 'Wildcard Challenge #1',
    scenarioContent: 'A photo shows a supposed handwritten letter from 1850 declaring alien contact. The text is printed in a modern computer digital font on stained paper.',
    question: 'Does finding a modern computer font on a supposed 1850s document prove it is a modern fake?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Digital computer vector fonts did not exist in 1850!',
    explanation: 'Yes! Anachronisms (things in the wrong time period) prove forgeries. Computer fonts didn\'t exist in 1850, no matter how much coffee stain is on the paper.',
    mediaLiteracyTip: 'Look for anachronisms: Check if the fonts, slang, or technology depicted existed in that time period.',
    difficulty: 'challenge'
  },
  {
    id: 'mr-02',
    category: 'MYSTERY_ROUND',
    scenarioType: 'social_post',
    scenarioSource: 'Wildcard Challenge #2',
    scenarioContent: 'A video shows a world leader speaking in Japanese with slightly robotic pacing and zero natural breathing sounds.',
    question: 'Can generative AI voice cloning create realistic foreign-language speech of public figures without their permission?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Modern AI tools can clone a voice from a 10-second sample and translate it into any language!',
    explanation: 'Yes! Generative AI voice tools can clone anyone\'s voice with only a few seconds of audio and make them say whatever the creator wants.',
    mediaLiteracyTip: 'Cross-check official transcripts: State speeches are always published on official government websites.',
    difficulty: 'challenge'
  },
  {
    id: 'mr-03',
    category: 'MYSTERY_ROUND',
    scenarioType: 'search',
    scenarioSource: 'Wildcard Challenge #3',
    scenarioContent: 'You search for a controversial topic. Every news article on the first page of search results is secretly owned by the exact same parent media corporation.',
    question: 'Can one company owning dozens of local news outlets create a false impression of independent consensus?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'When one company owns all the outlets, they can make them all read the same script!',
    explanation: 'Yes! When one company owns dozens of news outlets, they can push the same viewpoint across all of them, making it look like everyone agrees.',
    mediaLiteracyTip: 'Check media ownership: Seek out diverse independent news sources and public broadcasters.',
    difficulty: 'challenge'
  },
  {
    id: 'mr-04',
    category: 'MYSTERY_ROUND',
    scenarioType: 'chat',
    scenarioSource: 'Wildcard Challenge #4',
    scenarioContent: 'A direct message from what looks like your friend\'s profile says: "Hey, I lost my phone! Can you text me the 6-digit code you just got on your phone?"',
    question: 'Should you EVER share a two-factor security code sent to your phone with anyone in chat?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'The scammer is trying to reset YOUR account and needs your secret SMS code to break in!',
    explanation: 'No! Scammers hack a friend\'s account, then trigger a password reset on YOUR account and ask you for the security code to take it over.',
    mediaLiteracyTip: 'NEVER share two-factor security SMS codes with anyone—not even friends! Call them on the phone to check.'
  },
  {
    id: 'mr-05',
    category: 'MYSTERY_ROUND',
    scenarioType: 'headline',
    scenarioSource: 'Wildcard Challenge #5',
    scenarioContent: 'A viral video shows a teenager jumping clean over a moving two-story bus. The camera shakes violently with crazy digital zooms during the jump.',
    question: 'Is violent artificial camera shake often added in video editing to hide fake CGI mistakes?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Shaky camera movement hides blurry CGI edges and fake physics!',
    explanation: 'Yes! Adding heavy camera shake and rapid digital zoom in video editing is a classic technique to mask CGI compositing mistakes.',
    mediaLiteracyTip: 'Be skeptical of crazy physical stunts paired with extreme camera shake and blur.'
  },
  {
    id: 'mr-06',
    category: 'MYSTERY_ROUND',
    scenarioType: 'product',
    scenarioSource: 'Wildcard Challenge #6',
    scenarioContent: 'A crowdfunding page raises $5 million for an "Underwater Breathing Crystal" showing only 3D cartoon renders and zero real prototypes.',
    question: 'Are 3D cartoon renders proof that a physical gadget actually exists and works in real life?',
    options: ['YES', 'NO'],
    correctIndex: 1, // NO
    clue: 'Anyone can draw a 3D animation, but building real working hardware is completely different!',
    explanation: 'No! Crowdfunding is full of shiny 3D computer animations for gadgets that never get built. Without independent physical lab testing, it is vaporware.',
    mediaLiteracyTip: 'Separate concept art from working hardware. Look for real video demonstrations and lab testing.'
  },
  {
    id: 'mr-07',
    category: 'MYSTERY_ROUND',
    scenarioType: 'search',
    scenarioSource: 'Wildcard Challenge #7',
    scenarioContent: 'Your social feed keeps recommending posts about disasters and wars because you clicked on two sad news stories yesterday.',
    question: 'Can social media algorithms trap users in negative "filter bubbles" that exaggerate fear to keep them on the app?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'Algorithms keep serving doom content if they see it keeps you scrolling!',
    explanation: 'Yes! Recommendation engines optimize for screen time. If doomscrolling keeps you reading, the system serves you more catastrophic content.',
    mediaLiteracyTip: 'Audit your feed! Follow constructive, educational accounts to avoid algorithmic doom spirals.'
  },
  {
    id: 'mr-08',
    category: 'MYSTERY_ROUND',
    scenarioType: 'social_post',
    scenarioSource: 'Wildcard Challenge #8',
    scenarioContent: 'A photo shows two objects where one shadow points to the left, but the other shadow points to the right.',
    question: 'Do conflicting shadow directions prove that a photo was spliced together in Photoshop?',
    options: ['YES', 'NO'],
    correctIndex: 0, // YES
    clue: 'In a real scene with one sun or light, all shadows must point in the exact same direction!',
    explanation: 'Yes! In the real physical world, light from the sun or a spotlight casts all shadows in the same direction. Opposing shadows prove photo tampering.',
    mediaLiteracyTip: 'Follow the light: Check shadow angles and face highlights to spot photoshopped images.',
    difficulty: 'challenge'
  }
];

export function getQuestionForCategory(
  category: Category, 
  excludedIds: string[] = []
): Question {
  let eligibleQuestions: Question[];

  if (category === 'MYSTERY_ROUND') {
    eligibleQuestions = QUESTIONS.filter(q => !excludedIds.includes(q.id));
  } else {
    eligibleQuestions = QUESTIONS.filter(
      q => q.category === category && !excludedIds.includes(q.id)
    );
  }

  if (eligibleQuestions.length === 0) {
    eligibleQuestions = category === 'MYSTERY_ROUND' 
      ? QUESTIONS 
      : QUESTIONS.filter(q => q.category === category);
  }

  const randomIndex = Math.floor(Math.random() * eligibleQuestions.length);
  return eligibleQuestions[randomIndex];
}
