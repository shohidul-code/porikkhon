export type Question={id:string;stem:string;options:string[];answer:number;explanation:string;subject:string;category:string;difficulty:string};
const make=(prefix:string,category:string,subject:string,rows:[string,string[],number,string][]):Question[]=>rows.map((r,i)=>({id:`${prefix}-${i+1}`,stem:r[0],options:r[1],answer:r[2],explanation:r[3],subject,category,difficulty:i%3===0?'Challenge':i%3===1?'Foundation':'Standard'}));
export const QUESTIONS:Question[]=[
...make('math','Admission','Mathematics',[
['If 3x + 7 = 22, what is x?',['3','5','7','9'],1,'Subtract 7 from both sides: 3x = 15. Divide by 3 to get x = 5.'],
['A number increases from 80 to 100. What is the percentage increase?',['20%','25%','30%','80%'],1,'The increase is 20. Divide by the original 80 and multiply by 100: 25%.'],
['What is the next number in 2, 6, 12, 20, 30, …?',['36','40','42','48'],2,'The differences are 4, 6, 8, 10. The next difference is 12, so the answer is 42.'],
['The average of 8, 12, 16 and x is 14. Find x.',['16','18','20','22'],2,'Four numbers with average 14 have total 56. The known numbers total 36, so x = 20.'],
['A fair die is rolled once. What is the probability of an even number?',['1/6','1/3','1/2','2/3'],2,'There are three even outcomes (2, 4, 6) among six equally likely outcomes: 3/6 = 1/2.'],
['If the radius of a circle doubles, its area becomes:',['Twice as large','Three times as large','Four times as large','Eight times as large'],2,'Area is πr². Replacing r with 2r multiplies area by 4.'],
['Solve: 2² × 2³ = ?',['16','24','32','64'],2,'When multiplying powers with the same base, add exponents: 2⁵ = 32.'],
['A train travels 150 km in 2.5 hours. Its average speed is:',['50 km/h','55 km/h','60 km/h','75 km/h'],2,'Average speed = distance/time = 150/2.5 = 60 km/h.'],
['If a:b = 2:3 and b:c = 4:5, then a:c is:',['2:5','8:15','3:5','4:15'],1,'Use a common value b = 12. Then a = 8 and c = 15, giving 8:15.'],
['The sum of the interior angles of a hexagon is:',['540°','600°','720°','900°'],2,'For n sides, the sum is (n−2) × 180°. For 6 sides, this is 720°.'],
['What is log₁₀(1000)?',['2','3','10','100'],1,'10³ = 1000, so log₁₀(1000) = 3.'],
['A shop gives a 10% discount on ৳500. What is the sale price?',['৳400','৳425','৳450','৳490'],2,'10% of 500 is 50. Subtract the discount to get ৳450.']
]),
...make('eng','Admission','English',[
['Choose the correct sentence.',['She do not like tea.','She does not likes tea.','She does not like tea.','She not likes tea.'],2,'After does not, use the base form of the verb: like.'],
['Which word is closest in meaning to “concise”?',['Lengthy','Brief','Unclear','Repeated'],1,'Concise means giving information clearly in few words; brief is the closest option.'],
['Choose the correct preposition: She is interested ___ science.',['on','at','in','with'],2,'The standard expression is interested in something.'],
['Choose the antonym of “scarce”.',['Rare','Limited','Abundant','Insufficient'],2,'Scarce means not plentiful. Abundant means plentiful, so it is the opposite.'],
['Which sentence uses the present perfect tense?',['I visited Dhaka yesterday.','I have visited Dhaka.','I am visiting Dhaka.','I will visit Dhaka.'],1,'The present perfect uses have/has + past participle: have visited.'],
['Choose the correctly spelled word.',['Accomodation','Acommodation','Accommodation','Accommmodation'],2,'Accommodation is spelled with two c letters and two m letters.'],
['Fill in: Neither of the answers ___ correct.',['are','were','is','have'],2,'In formal standard usage, neither is singular here and takes is.'],
['Identify the passive voice.',['They built the bridge.','The bridge was built by them.','They are building a bridge.','They will build it.'],1,'The subject receives the action in passive voice: was built.'],
['Choose the correct article: He is ___ honest person.',['a','an','the','no article'],1,'Honest begins with a vowel sound because h is silent; use an.'],
['“Although it was raining, we continued.” Although introduces:',['A reason','A contrast','A result','A place'],1,'Although introduces a concession or contrast between the two clauses.'],
['Choose the correct form: If I ___ you, I would revise today.',['am','was','were','be'],2,'The hypothetical expression uses the subjunctive: If I were you.'],
['Which word is a conjunction?',['Quickly','Under','Because','Beautiful'],2,'Because connects clauses and introduces a reason; it is a conjunction.']
]),
...make('gk','BCS & Jobs','General knowledge',[
['বাংলাদেশের স্বাধীনতা দিবস কবে?',['২১ ফেব্রুয়ারি','২৬ মার্চ','১৬ ডিসেম্বর','১৪ এপ্রিল'],1,'বাংলাদেশের স্বাধীনতা দিবস ২৬ মার্চ। বিজয় দিবস ১৬ ডিসেম্বর।'],
['The United Nations was established in which year?',['1919','1945','1948','1952'],1,'The United Nations officially came into existence on 24 October 1945.'],
['Which organ pumps blood through the human body?',['Liver','Kidney','Heart','Lung'],2,'The heart generates the pressure that circulates blood through the body.'],
['বাংলা বর্ণমালায় প্রচলিত স্বরবর্ণের সংখ্যা কত?',['৯','১০','১১','১২'],2,'বাংলা বর্ণমালায় প্রচলিত স্বরবর্ণ ১১টি।'],
['Which is the largest ocean on Earth?',['Atlantic','Indian','Arctic','Pacific'],3,'The Pacific Ocean has the largest surface area of all oceans.'],
['The chemical symbol for gold is:',['Ag','Au','Fe','Gd'],1,'Au comes from the Latin word aurum and is the chemical symbol for gold.'],
['বাংলাদেশের জাতীয় ফুল কোনটি?',['গোলাপ','শাপলা','জবা','বেলি'],1,'শাপলা বাংলাদেশের জাতীয় ফুল।'],
['Which gas do plants primarily absorb during photosynthesis?',['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],2,'Plants use carbon dioxide and water to produce sugars during photosynthesis.'],
['Who wrote “Hamlet”?',['William Shakespeare','Charles Dickens','Jane Austen','John Milton'],0,'Hamlet is a tragedy written by William Shakespeare.'],
['The SI unit of electric current is:',['Volt','Ohm','Watt','Ampere'],3,'The ampere is the SI base unit of electric current.'],
['The Earth takes approximately how long to orbit the Sun?',['24 hours','30 days','365.25 days','10 years'],2,'One orbit takes about 365.25 days, which is the basis for a year.'],
['রবীন্দ্রনাথ ঠাকুর কোন কাব্যগ্রন্থের জন্য নোবেল পুরস্কার পান?',['সোনার তরী','গীতাঞ্জলি','বলাকা','সঞ্চয়িতা'],1,'রবীন্দ্রনাথ ঠাকুর ১৯১৩ সালে গীতাঞ্জলির ইংরেজি অনুবাদের জন্য সাহিত্যে নোবেল পুরস্কার পান।']
]),
...make('sci','SSC & HSC','Science',[
['Which SI unit measures force?',['Joule','Newton','Watt','Pascal'],1,'The newton is the SI unit of force. One newton equals one kilogram metre per second squared.'],
['A body of mass 2 kg accelerates at 3 m/s². The net force is:',['1.5 N','5 N','6 N','9 N'],2,'Newton’s second law gives F = ma = 2 × 3 = 6 N.'],
['A solution with pH 3 is:',['Acidic','Neutral','Basic','Always pure water'],0,'A pH below 7 is acidic under ordinary aqueous conditions.'],
['Which structure is commonly called the powerhouse of the cell?',['Nucleus','Ribosome','Mitochondrion','Cell wall'],2,'Mitochondria produce much of the ATP used by eukaryotic cells.'],
['At constant temperature, pressure and volume of a fixed gas sample are:',['Directly proportional','Inversely proportional','Always equal','Unrelated'],1,'Boyle’s law states PV is constant for a fixed amount of gas at constant temperature.'],
['Which cell structure controls the movement of substances into and out of a cell?',['Ribosome','Chromosome','Cell membrane','Nucleolus'],2,'The selectively permeable cell membrane regulates movement between the cell and its surroundings.'],
['Which quantity is a vector?',['Mass','Temperature','Speed','Velocity'],3,'Velocity has both magnitude and direction; speed is a scalar.'],
['The atomic number of an element equals its number of:',['Neutrons','Protons','Protons plus neutrons','Electron shells'],1,'Atomic number is defined as the number of protons in the nucleus.'],
['Which blood cells mainly transport oxygen?',['Red blood cells','White blood cells','Platelets','All equally'],0,'Hemoglobin in red blood cells binds and transports oxygen.'],
['A 10 Ω resistor carries 2 A. The voltage across it is:',['5 V','12 V','20 V','40 V'],2,'Ohm’s law gives V = IR = 2 × 10 = 20 V.'],
['Which process changes a liquid directly into a gas at its surface?',['Freezing','Evaporation','Condensation','Melting'],1,'Evaporation is vaporization that occurs at the surface of a liquid.'],
['In a controlled experiment, which variable does the investigator deliberately change?',['Independent variable','Dependent variable','Every variable','Measured outcome only'],0,'The independent variable is deliberately changed. Its effect on the dependent variable is measured while other relevant conditions are controlled.']
]),
...make('skill','Skills','Aptitude & computing',[
['Which data structure follows FIFO order?',['Stack','Queue','Tree','Set'],1,'A queue removes items in first-in, first-out order.'],
['The binary number 1010 equals which decimal number?',['8','9','10','12'],2,'1010₂ = 8 + 0 + 2 + 0 = 10.'],
['Which SQL clause filters groups after aggregation?',['WHERE','ORDER BY','HAVING','JOIN'],2,'HAVING filters grouped results; WHERE filters rows before grouping.'],
['In a sorted array, binary search has worst-case time complexity:',['O(1)','O(log n)','O(n)','O(n²)'],1,'Binary search halves the remaining search interval at each step, giving O(log n).'],
['Which is the strongest general password practice?',['Reuse a short password','Use a unique long password with a password manager','Share it with a trusted classmate','Use your birth date'],1,'Unique, long passwords stored in a password manager reduce reuse and guessing risks.'],
['What does HTTP status 404 commonly indicate?',['Success','Unauthorized request','Resource not found','Server maintenance only'],2,'HTTP 404 means the server did not find the requested resource.'],
['Which is a valid IPv4 address?',['192.168.1.1','300.168.1.1','192.168.1','192.168.one.1'],0,'IPv4 uses four decimal octets, each between 0 and 255.'],
['If all roses are flowers and some flowers fade quickly, which must be true?',['All roses fade quickly','No roses fade quickly','All roses are flowers','Some roses are not flowers'],2,'Only the first premise about all roses necessarily follows. The fading statement does not identify roses.'],
['A task takes 6 people 10 days. At the same per-person rate, 3 people take:',['5 days','10 days','15 days','20 days'],3,'The work is 60 person-days. With 3 people it takes 60/3 = 20 days.'],
['Which technique helps prevent SQL injection?',['String concatenation','Parameterized queries','Hiding the login button','Using shorter table names'],1,'Parameterized queries separate SQL instructions from data supplied by users.'],
['What is 15% of 240?',['24','30','36','48'],2,'0.15 × 240 = 36.'],
['A logical AND expression is true when:',['At least one input is true','Both inputs are true','Both inputs are false','The first input is false'],1,'AND returns true only when both operands are true.']
])];
export type Exam={id:string;title:string;category:string;subject:string;minutes:number;count:number;penalty:number;difficulty:string;color:string;kind:string;description:string};
export const EXAMS:Exam[]=[
{id:'admission-english',title:'English essentials',category:'Admission',subject:'English',minutes:12,count:12,penalty:.25,difficulty:'Foundation',color:'coral',kind:'Full model test',description:'Grammar, vocabulary, and the details that make a difference.'},
{id:'admission-math',title:'Quantitative confidence',category:'Admission',subject:'Mathematics',minutes:15,count:12,penalty:.25,difficulty:'Standard',color:'teal',kind:'Subject test',description:'Build your problem-solving rhythm, one question at a time.'},
{id:'bcs-foundation',title:'BCS knowledge builder',category:'BCS & Jobs',subject:'General knowledge',minutes:12,count:12,penalty:.5,difficulty:'Foundation',color:'lilac',kind:'Full model test',description:'Evergreen general knowledge with clear, useful explanations.'},
{id:'hsc-science',title:'Science, made clearer',category:'SSC & HSC',subject:'Science',minutes:15,count:12,penalty:0,difficulty:'Standard',color:'lime',kind:'Subject test',description:'Reconnect the ideas behind physics, chemistry, and biology.'},
{id:'skill-aptitude',title:'Think a little sharper',category:'Skills',subject:'Aptitude & computing',minutes:12,count:12,penalty:.25,difficulty:'Challenge',color:'peach',kind:'Skills assessment',description:'Logic, computing fundamentals, and practical reasoning.'},
{id:'mixed-foundation',title:'Your foundation check',category:'All tracks',subject:'Mixed',minutes:20,count:20,penalty:.25,difficulty:'Standard',color:'sky',kind:'Mixed practice',description:'A balanced check-in across English, mathematics, and science.'},
{id:'daily-challenge',title:'The daily reasoning sprint',category:'Skills',subject:'Aptitude & computing',minutes:8,count:8,penalty:.25,difficulty:'Challenge',color:'teal',kind:'Live challenge',description:'Join the daily 8 PM Bangladesh-time challenge. Practice with purpose.'}
];
export function examQuestions(exam:Exam):Question[]{if(exam.subject==='Mixed'){const groups=['Mathematics','English','Science'].map(subject=>QUESTIONS.filter(q=>q.subject===subject));return Array.from({length:exam.count},(_,i)=>groups[i%3][Math.floor(i/3)]).filter(Boolean);}return QUESTIONS.filter(q=>q.subject===exam.subject).slice(0,exam.count);}
export const findQuestion=(id:string)=>QUESTIONS.find(q=>q.id===id);
