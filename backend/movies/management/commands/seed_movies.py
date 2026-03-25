from django.core.management.base import BaseCommand

from movies.models import Movie


VIDEO_POOL = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
]


def make_title(title, description, image, category, rating, maturity, year, duration, tags, video_index):
    return {
        "title": title,
        "description": description,
        "thumbnail_image": image,
        "video_url": VIDEO_POOL[video_index % len(VIDEO_POOL)],
        "category": category,
        "rating": rating,
        "maturity_rating": maturity,
        "year": year,
        "duration": duration,
        "tags": tags,
    }


SAMPLE_MOVIES = [
    make_title("Red Horizon", "A renegade pilot uncovers a conspiracy while racing across a dying galaxy.", "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80", "Trending", 8.8, "16+", 2024, "2h 08m", ["Movie", "Sci-Fi", "Action"], 0),
    make_title("Silent Circuit", "An elite hacker must outsmart a sentient surveillance network before it rewrites the world.", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80", "Top Rated", 9.1, "13+", 2023, "1h 54m", ["Movie", "Thriller", "Tech"], 1),
    make_title("Velvet Heist", "A retired thief returns for one last impossible art robbery in Paris.", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80", "Popular", 8.4, "16+", 2022, "2h 02m", ["Movie", "Crime", "Drama"], 2),
    make_title("North of Winter", "Two siblings cross the Arctic wilderness searching for a vanished research team.", "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1200&q=80", "Adventure", 8.2, "13+", 2024, "1h 49m", ["Movie", "Adventure", "Drama"], 3),
    make_title("Laugh Track", "A washed-up sitcom star reinvents herself in the unpredictable world of live stand-up.", "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80", "Comedy", 7.9, "10+", 2021, "1h 37m", ["Movie", "Comedy", "Feel Good"], 4),
    make_title("Deep Current", "A marine biologist discovers a hidden civilization beneath the Pacific Ocean.", "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80", "New Releases", 8.6, "13+", 2025, "2h 14m", ["Movie", "Fantasy", "Adventure"], 5),
    make_title("Glass Harbor", "A political fixer returns home and finds a coastal city ruled by secrets, old money, and media empires.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "Trending", 8.7, "16+", 2025, "8 Episodes", ["Series", "Political", "Drama"], 6),
    make_title("Zero Trace", "A cybercrime unit hunts a digital ghost who can erase people from every system they depend on.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", "Top Rated", 9.0, "16+", 2024, "10 Episodes", ["Series", "Tech", "Thriller"], 7),
    make_title("Midnight Republic", "A disgraced journalist uncovers a conspiracy linking celebrity culture, surveillance, and a rigged election.", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", "Popular", 8.5, "18+", 2024, "6 Episodes", ["Series", "Investigative", "Drama"], 0),
    make_title("Atlas 9", "Nine strangers wake up in an orbital station with no memory and a countdown they cannot stop.", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80", "Sci-Fi", 8.8, "13+", 2025, "8 Episodes", ["Series", "Sci-Fi", "Mystery"], 1),
    make_title("Black Ledger", "A forensic accountant stumbles into a laundering network with ties to national intelligence.", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", "Crime Thrillers", 8.7, "16+", 2025, "2h 05m", ["Movie", "Crime", "Thriller"], 2),
    make_title("Signal Lost", "A rescue squad races through a collapsing mountain network to reach trapped astronauts before a storm hits.", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", "Action Nights", 8.2, "13+", 2024, "1h 51m", ["Movie", "Action", "Adventure"], 3),
    make_title("Monsoon Station", "Commuters trapped during a record storm reveal tangled lives, betrayals, and one missing child.", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", "International Series", 8.6, "13+", 2024, "10 Episodes", ["Series", "Drama", "Ensemble"], 4),
    make_title("Bluebird Hostel", "Young artists, broken hearts, and one fading music venue collide in a warm coming-of-age drama.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80", "Romance & Drama", 8.0, "13+", 2023, "12 Episodes", ["Series", "Romance", "Drama"], 5),
    make_title("Tiny Giants FC", "A small-town youth football club chases its first national title while families fight to keep it alive.", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80", "Family Watch", 8.1, "7+", 2025, "6 Episodes", ["Series", "Family", "Sports"], 6),
    make_title("Terminally Online", "An exhausted culture reporter gets trapped inside the internet's strangest subcultures for a career-saving story.", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", "Comedy", 8.0, "13+", 2024, "8 Episodes", ["Series", "Comedy", "Satire"], 7),
    make_title("Blue Carbon", "Scientists, activists, and coastal communities fight to restore ecosystems before they disappear forever.", "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80", "Documentaries", 8.9, "10+", 2025, "4 Episodes", ["Series", "Documentary", "Nature"], 0),
    make_title("Ashes of Empire", "Rival heirs and a rebel mapmaker reshape a continent as an empire collapses from within.", "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&w=1200&q=80", "Fantasy Worlds", 8.8, "16+", 2025, "10 Episodes", ["Series", "Fantasy", "Epic"], 1),
    make_title("Offside Stories", "A behind-the-scenes docuseries follows the athletes, coaches, and scouts trying to change a league forever.", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 8.2, "10+", 2025, "5 Episodes", ["Series", "Sports", "Documentary"], 2),
    make_title("Code Name Paloma", "A multilingual covert operative must expose a private military network operating in luxury resorts.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "New Releases", 8.5, "16+", 2026, "1h 57m", ["Movie", "Spy", "Action"], 3),
    make_title("Parallel Summer", "Five teenagers discover a beach town where every sunset opens into a different timeline.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "New Releases", 8.1, "13+", 2026, "8 Episodes", ["Series", "YA", "Sci-Fi"], 4),
]


EXTRA_TITLES = [
    ("Metro Line 8", "A late-night train route becomes the only safe passage through a city-wide blackout.", "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80", "Action Nights", 8.1, "16+", 2025, "1h 48m", ["Movie", "Action", "Survival"]),
    ("Crimson Runway", "A hijacked cargo plane forces an ex-pilot back into the sky for one impossible rescue.", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80", "Action Nights", 8.0, "13+", 2026, "1h 58m", ["Movie", "Action", "Rescue"]),
    ("Night Siege", "A tactical unit fights floor by floor to stop a hostage crisis in the city's tallest hotel.", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", "Action Nights", 8.3, "16+", 2025, "2h 04m", ["Movie", "Action", "Thriller"]),
    ("Steel Current", "A cargo ship engineer leads a mutiny after pirates take control of an energy convoy.", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", "Action Nights", 7.9, "13+", 2024, "8 Episodes", ["Series", "Action", "Sea"]),
    ("Harbor Unit", "A marine police task force tackles smuggling, storms, and political pressure on the coastline.", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", "Crime Thrillers", 8.3, "16+", 2024, "9 Episodes", ["Series", "Crime", "Procedural"]),
    ("Cold Room", "A murder in a private bank vault puts an ambitious detective up against a family that owns the city.", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", "Crime Thrillers", 8.2, "16+", 2025, "1h 57m", ["Movie", "Crime", "Mystery"]),
    ("Vanishing Point Bureau", "A forgotten department solves disappearances everyone powerful wants buried.", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", "Crime Thrillers", 8.5, "16+", 2026, "8 Episodes", ["Series", "Crime", "Investigation"]),
    ("The Silent Witness", "A courtroom translator becomes the only person who understands a killer's final confession.", "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80", "Crime Thrillers", 8.1, "13+", 2024, "2h 00m", ["Movie", "Crime", "Courtroom"]),
    ("Sky Archive", "Historians uncover a floating library that predicts disasters before they happen.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80", "Sci-Fi", 8.4, "13+", 2026, "7 Episodes", ["Series", "Sci-Fi", "Adventure"]),
    ("Solar Tide", "A mining colony near Mercury discovers its power grid is being controlled by something alive.", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80", "Sci-Fi", 8.3, "13+", 2026, "2h 06m", ["Movie", "Sci-Fi", "Space"]),
    ("Echo Chamber", "A startup builds memory-sharing devices that let users relive other people's lives.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", "Sci-Fi", 8.0, "16+", 2025, "8 Episodes", ["Series", "Sci-Fi", "Tech"]),
    ("Gravity Children", "A school on a lunar ring station trains the first generation born without Earth below them.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80", "Sci-Fi", 8.2, "10+", 2024, "10 Episodes", ["Series", "Sci-Fi", "Coming-of-age"]),
    ("Far Lantern Road", "A mountain guide escorts refugees across a frozen pass while old myths begin to feel real.", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", "Adventure", 8.0, "13+", 2025, "2h 03m", ["Movie", "Adventure", "Survival"]),
    ("Storm Cartographers", "A team of weather explorers maps impossible storms forming over an uncharted sea.", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", "Adventure", 8.3, "13+", 2026, "8 Episodes", ["Series", "Adventure", "Discovery"]),
    ("Wild Meridian", "A geologist and a rescue pilot race through volcano country to stop a town from vanishing.", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", "Adventure", 7.9, "13+", 2024, "1h 55m", ["Movie", "Adventure", "Thriller"]),
    ("Broken Compass", "Treasure hunters searching old trade routes awaken a feud between island families.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "Adventure", 8.1, "13+", 2025, "10 Episodes", ["Series", "Adventure", "Mystery"]),
    ("Paper Crowns", "Three heirs wage a silent war for control of a family-owned media empire.", "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80", "Trending", 8.6, "16+", 2025, "8 Episodes", ["Series", "Drama", "Power"]),
    ("Blackwater Heights", "A luxury residential tower hides a surveillance experiment behind concierge smiles.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "Trending", 8.4, "16+", 2026, "8 Episodes", ["Series", "Thriller", "Drama"]),
    ("Golden Assembly", "A breakout legislator takes on corruption while the entire nation watches her every move.", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80", "Trending", 8.3, "13+", 2025, "2h 01m", ["Movie", "Politics", "Drama"]),
    ("Open Water Mile", "A champion swimmer returns after injury to chase one impossible world record.", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 7.9, "10+", 2024, "1h 52m", ["Movie", "Sports", "Inspiration"]),
    ("Frame by Frame", "Documentary filmmakers capture the hidden economies powering global entertainment.", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", "Documentaries", 8.4, "10+", 2025, "3 Episodes", ["Series", "Documentary", "Media"]),
    ("Night Market", "A food journalist and an undercover cop cross paths in a neon-lit maze of secrets.", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80", "Popular", 8.2, "13+", 2024, "2h 01m", ["Movie", "Mystery", "Drama"]),
    ("Velvet District", "A nightclub singer and a city auditor unravel a corruption ring one whispered deal at a time.", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80", "Popular", 8.1, "13+", 2025, "8 Episodes", ["Series", "Drama", "Mystery"]),
    ("Copper Avenue", "A celebrity chef and a tabloid reporter become unlikely allies after witnessing a political assassination.", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", "Popular", 8.0, "16+", 2026, "2h 03m", ["Movie", "Thriller", "Drama"]),
    ("Library of Rain", "A lonely archivist finds a hidden floor where lost memories are cataloged as books.", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80", "Fantasy Worlds", 8.3, "13+", 2024, "1h 56m", ["Movie", "Fantasy", "Drama"]),
    ("Quiet Summer Club", "Old friends reconnect at a lakeside town where every reunion changes their future.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "Romance & Drama", 7.9, "10+", 2025, "8 Episodes", ["Series", "Romance", "Drama"]),
    ("After the Monsoon", "Two former lovers rebuild a village theater while hiding the reason they left years ago.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80", "Romance & Drama", 8.1, "13+", 2026, "10 Episodes", ["Series", "Romance", "Drama"]),
    ("Summer Postcards", "A travel writer and a quiet architect exchange letters across countries and missed chances.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "Romance & Drama", 7.8, "10+", 2024, "1h 46m", ["Movie", "Romance", "Drama"]),
    ("Harbor Letters", "A widow discovers a box of unsent messages that reconnect an entire coastal town.", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80", "Romance & Drama", 8.0, "13+", 2025, "8 Episodes", ["Series", "Romance", "Feel Good"]),
    ("City Zero", "The first smart city designed by AI begins making decisions its creators cannot override.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", "Top Rated", 8.9, "16+", 2026, "2h 10m", ["Movie", "Sci-Fi", "Tech"]),
    ("Starlight Bench", "A celebrated playwright returns with one final script that exposes everyone who helped ruin him.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80", "Top Rated", 8.8, "16+", 2025, "2h 00m", ["Movie", "Drama", "Prestige"]),
    ("The Last Meridian", "A climate mission at the edge of the world becomes humanity's final gamble for survival.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80", "Top Rated", 8.9, "13+", 2025, "2h 21m", ["Movie", "Sci-Fi", "Epic"]),
    ("The Garden Shift", "Young doctors on the overnight shift learn how thin the line is between healing and heartbreak.", "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80", "Web Series", 8.3, "13+", 2025, "10 Episodes", ["Series", "Medical", "Drama"]),
    ("Sector Blue", "A deep-sea extraction crew discovers signals from an ancient machine under the ocean floor.", "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80", "Web Series", 8.5, "13+", 2026, "8 Episodes", ["Series", "Sci-Fi", "Mystery"]),
    ("Street Saints", "A neighborhood basketball court becomes the center of loyalty, rivalry, and second chances.", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", "Movies", 7.8, "13+", 2024, "1h 58m", ["Movie", "Sports", "Drama"]),
    ("Crown Protocol", "A former palace guard is drawn into a global conspiracy after a ceremonial attack.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "Movies", 8.2, "16+", 2025, "2h 07m", ["Movie", "Action", "Thriller"]),
    ("Mirror Lake", "A family retreat turns into a psychological survival game when a child vanishes overnight.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "Movies", 8.0, "16+", 2023, "1h 50m", ["Movie", "Thriller", "Drama"]),
    ("Golden Borough", "A mayoral race and a neighborhood uprising collide in a sharp urban political thriller.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "Movies", 8.3, "16+", 2026, "2h 11m", ["Movie", "Drama", "Politics"]),
    ("Static Harbor", "A ferry engineer finds coded distress calls hidden inside public radio frequencies.", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", "Movies", 8.0, "13+", 2025, "1h 53m", ["Movie", "Mystery", "Thriller"]),
    ("First Signal", "Teen coders intercept a transmission that points to intelligent life already inside Earth's networks.", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.6, "13+", 2026, "9 Episodes", ["Series", "Original", "Sci-Fi"]),
    ("Velour City", "An ambitious singer climbs through fashion houses and club politics to become the city's loudest new icon.", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.1, "16+", 2025, "8 Episodes", ["Series", "Original", "Music"]),
    ("Iron Bloom", "A post-war robotics company hides a prototype capable of rewriting memory itself.", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.8, "16+", 2026, "2h 09m", ["Movie", "Original", "Sci-Fi"]),
    ("Firelight Estate", "The heirs of a luxury empire hide a murder behind charity galas and streaming fame.", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.2, "16+", 2025, "8 Episodes", ["Series", "Original", "Drama"]),
    ("Terminal Snow", "Passengers trapped in a high-speed alpine terminal discover the blizzard outside is man-made.", "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.4, "13+", 2026, "2h 00m", ["Movie", "Original", "Thriller"]),
    ("Moon Garden Academy", "Students train to terraform lunar valleys while navigating class politics and first love.", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80", "Anime", 8.7, "13+", 2025, "12 Episodes", ["Anime", "Sci-Fi", "Drama"]),
    ("Foxfire Ronin", "A wandering swordswoman protects spirit villages from industrial armies and cursed machines.", "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80", "Anime", 8.9, "16+", 2026, "24 Episodes", ["Anime", "Fantasy", "Action"]),
    ("Project Kestrel", "Teen pilots train to sync with biomechanical aircraft built from extinct species.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80", "Anime", 8.4, "13+", 2024, "13 Episodes", ["Anime", "Mecha", "Adventure"]),
    ("After School Orbit", "A school astronomy club discovers they have been charting messages from a hidden colony.", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", "Anime", 8.2, "10+", 2025, "12 Episodes", ["Anime", "Coming-of-age", "Sci-Fi"]),
    ("Signal Blossom", "A shy inventor and a runaway fox spirit build forbidden machines in a floating garden city.", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", "Anime", 8.1, "10+", 2025, "12 Episodes", ["Anime", "Fantasy", "Adventure"]),
    ("North Gate Files", "A city intelligence archive reveals cold cases with links to today's most powerful families.", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80", "Web Series", 8.4, "16+", 2024, "7 Episodes", ["Series", "Thriller", "Mystery"]),
    ("Sunline Hotel", "Guests at a luxury coastal hotel collide during one holiday weekend that changes every life involved.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "Web Series", 8.0, "13+", 2025, "8 Episodes", ["Series", "Drama", "Ensemble"]),
    ("Last Page Society", "A bookstore basement hosts a secret club where every recommended novel predicts a member's future.", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.3, "13+", 2025, "8 Episodes", ["Series", "Original", "Mystery"]),
    ("Riptide Eleven", "An elite rescue team uses experimental surf drones to save lives along a storm-torn coastline.", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "Movies", 7.7, "13+", 2024, "1h 47m", ["Movie", "Action", "Adventure"]),
    ("Velvet Orbit", "A starship lounge singer becomes the accidental center of interplanetary diplomacy.", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.0, "13+", 2026, "10 Episodes", ["Series", "Original", "Space"]),
    ("Neon Shogun", "Tokyo's final district police force defends the city with code-forged blades and outlaw AI.", "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1200&q=80", "Anime", 8.8, "16+", 2026, "13 Episodes", ["Anime", "Cyberpunk", "Action"]),
    ("The Greenroom", "A struggling studio turns unknown performers into stars while hiding a toxic empire backstage.", "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80", "Web Series", 8.1, "16+", 2024, "9 Episodes", ["Series", "Music", "Drama"]),
    ("Amber Run", "A courier smuggles medicine across a collapsing state while hunted by corporate militias.", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80", "Movies", 8.1, "16+", 2025, "2h 03m", ["Movie", "Action", "Road"]),
    ("Second Sunrise", "The first Mars colony wakes to a sabotage mystery on the day it should become self-sufficient.", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80", "Netflix Originals", 8.7, "13+", 2026, "8 Episodes", ["Series", "Original", "Sci-Fi"]),
    ("Saffron Tracks", "A touring classical prodigy and a train chef build a fragile friendship across the subcontinent.", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", "International Series", 8.2, "13+", 2025, "8 Episodes", ["Series", "International", "Drama"]),
    ("Harbor Monsoon", "A port city survives floods, corruption, and grief when a storm season never ends.", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", "International Series", 8.4, "16+", 2026, "9 Episodes", ["Series", "International", "Thriller"]),
    ("Maple Street Dads", "Three fathers reinvent themselves while raising kids in a neighborhood that never stops watching.", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80", "Family Watch", 7.8, "7+", 2024, "10 Episodes", ["Series", "Family", "Comedy"]),
    ("Little Volcano Club", "A science fair team stumbles onto a sleeping volcano and a summer they will never forget.", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", "Family Watch", 8.0, "7+", 2025, "1h 42m", ["Movie", "Family", "Adventure"]),
    ("Wild Classroom", "Students and teachers create a school in the forest after a climate disaster closes their town.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "Family Watch", 8.1, "7+", 2026, "8 Episodes", ["Series", "Family", "Adventure"]),
    ("Sunday Bicycle Club", "Five kids rebuild abandoned bikes and turn their town into a place worth staying in.", "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80", "Family Watch", 7.9, "7+", 2025, "1h 38m", ["Movie", "Family", "Feel Good"]),
    ("Silent Habitat", "Architects and ecologists race to build the first fully self-sustaining neighborhood.", "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80", "Documentaries", 8.1, "10+", 2024, "2 Episodes", ["Series", "Documentary", "Architecture"]),
    ("The Last Orchard", "A farming family battles heat, debt, and global supply chains to save a heritage harvest.", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80", "Documentaries", 8.2, "10+", 2025, "1h 41m", ["Movie", "Documentary", "Earth"]),
    ("City Beneath Noise", "Urban planners and sound engineers try to redesign one of the loudest cities in the world.", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", "Documentaries", 8.0, "10+", 2026, "4 Episodes", ["Series", "Documentary", "Cities"]),
    ("Ivory Vale", "A cursed valley grants kingdoms power at the price of memory.", "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80", "Fantasy Worlds", 8.1, "13+", 2025, "8 Episodes", ["Series", "Fantasy", "Mystery"]),
    ("Citadel of Moss", "A fugitive botanist hides inside a living fortress where the walls decide who may enter.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "Fantasy Worlds", 8.5, "13+", 2026, "2h 06m", ["Movie", "Fantasy", "Adventure"]),
    ("The Fifth Crown", "A forgotten heir returns from exile with a map to the kingdom everyone thought was a myth.", "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&w=1200&q=80", "Fantasy Worlds", 8.2, "13+", 2025, "9 Episodes", ["Series", "Fantasy", "Epic"]),
    ("Penalty Box", "A disgraced hockey prodigy fights for one last season while mentoring a team of underdogs.", "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 8.0, "13+", 2025, "8 Episodes", ["Series", "Sports", "Drama"]),
    ("High Jump Lane", "An overlooked athlete and a data-driven coach chase a national title one centimeter at a time.", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 7.8, "10+", 2026, "1h 49m", ["Movie", "Sports", "Inspiration"]),
    ("The Final Over", "A veteran captain returns for one last championship run after a scandal ends his retirement.", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 8.1, "10+", 2025, "2h 02m", ["Movie", "Sports", "Comeback"]),
    ("Blue Turf", "A women’s football club rebuilds itself after losing every sponsor and half the roster.", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80", "Sports Stories", 8.3, "10+", 2026, "8 Episodes", ["Series", "Sports", "Drama"]),
]


for index, entry in enumerate(EXTRA_TITLES, start=len(SAMPLE_MOVIES)):
    SAMPLE_MOVIES.append(make_title(*entry, video_index=index))


class Command(BaseCommand):
    help = "Seed the database with a large streaming-style catalog for the Netflix clone."

    def handle(self, *args, **options):
        created = 0
        for payload in SAMPLE_MOVIES:
            movie = Movie.objects(title=payload["title"]).first()
            if movie:
                for key, value in payload.items():
                    setattr(movie, key, value)
                movie.save()
            else:
                Movie(**payload).save()
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seed complete. Added {created} titles and refreshed existing entries."))
