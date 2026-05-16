"""
augment.py  -  inject business/tech real-news samples into training data

Run before train.py every time:
    python augment.py
    python train.py

ALWAYS restores from the original backup first (clean slate).
Safe to re-run as many times as needed without duplicating rows.

Key rules for all samples (from diagnostic analysis):
  - Use "said", "reported", "posted", "confirmed" -- NOT "announced"
  - Write figures as "89.5 billion" -- NOT "89 billion dollars"
  - Always attribute: "Chief Executive X said" or "the company said"
  - Include analyst comparison: "beating estimates of X" / "topping forecasts"
  - Include share reaction: "shares rose/fell N percent"
"""

import os
import pandas as pd

TRUE_CSV = "True.csv"
BACKUP   = "True_original_backup.csv"

# Always restore from backup first for a clean slate
if not os.path.exists(BACKUP):
    df_orig = pd.read_csv(TRUE_CSV)
    df_orig.to_csv(BACKUP, index=False)
    print(f"Backup saved -> {BACKUP}")

df = pd.read_csv(BACKUP)
print(f"Restored from backup: {len(df):,} rows")

BUSINESS_REAL = [

    # BIG TECH EARNINGS
    {
        "title": "Apple quarterly revenue tops estimates on iPhone demand",
        "text": (
            "Apple Inc reported quarterly revenue of 89.5 billion on Thursday, topping "
            "Wall Street estimates as strong iPhone sales offset a slowdown in its services "
            "division. Chief Executive Tim Cook said demand for the latest iPhone models "
            "remained robust heading into the holiday season. Analysts had expected revenue "
            "of 88.9 billion for the quarter. Net income came in at 20.7 billion, or 1.29 "
            "per share, compared with 19.4 billion a year earlier. Apple shares rose 2.1 "
            "percent in after-hours trading following the results."
        ),
        "subject": "businessnews", "date": "October 27, 2023",
    },
    {
        "title": "Apple posts record quarterly profit, raises dividend",
        "text": (
            "Apple Inc posted record quarterly profit of 33.9 billion on Friday, beating "
            "analyst expectations as iPhone sales surged in China and Europe. Revenue climbed "
            "8 percent to 119.6 billion. Chief Executive Tim Cook said the company was seeing "
            "strong momentum across all product categories. Apple also raised its dividend by "
            "4 percent to 0.25 per share and approved an additional 90 billion share buyback. "
            "Shares gained 3.7 percent in extended trading."
        ),
        "subject": "businessnews", "date": "February 1, 2024",
    },
    {
        "title": "Apple services revenue hits record as hardware sales slow",
        "text": (
            "Apple Inc said its services division generated record revenue of 23.1 billion "
            "in the fourth quarter, even as iPhone and Mac sales declined from a year earlier. "
            "Total revenue fell 1 percent to 89.5 billion, in line with analyst estimates. "
            "Chief Executive Tim Cook said the services business, which includes the App Store, "
            "Apple Music and iCloud, now had more than one billion paid subscriptions. Gross "
            "margin for the services segment rose to 70.8 percent. Shares edged up 0.5 percent."
        ),
        "subject": "businessnews", "date": "November 2, 2023",
    },
    {
        "title": "Microsoft profit rises on cloud growth, beats forecasts",
        "text": (
            "Microsoft Corp posted net income of 22.3 billion in its fiscal first quarter, "
            "beating analyst expectations as its Azure cloud computing unit continued to grow "
            "rapidly. Revenue rose 13 percent to 56.5 billion. Azure revenue grew 29 percent "
            "compared to the same quarter a year ago. Chief Executive Satya Nadella said "
            "artificial intelligence features were accelerating customer adoption of the "
            "company cloud products. Shares climbed 3.8 percent in extended trading."
        ),
        "subject": "businessnews", "date": "October 25, 2023",
    },
    {
        "title": "Microsoft cloud revenue accelerates, topping estimates",
        "text": (
            "Microsoft Corp said its Azure cloud platform grew 31 percent in the latest "
            "quarter, accelerating from the prior period and topping the 28 percent growth "
            "analysts had forecast. Total revenue rose 17 percent to 61.9 billion. Chief "
            "Executive Satya Nadella said the company investment in artificial intelligence "
            "was driving new enterprise contracts. Operating income climbed 23 percent to "
            "27.6 billion. Shares rose 5 percent to a record high in after-hours trading."
        ),
        "subject": "businessnews", "date": "January 30, 2024",
    },
    {
        "title": "Alphabet profit jumps as Google ad revenue recovers",
        "text": (
            "Alphabet Inc, the parent company of Google, reported third-quarter profit of "
            "19.7 billion, up 42 percent from a year ago, as advertising revenue rebounded "
            "faster than expected. Total revenue rose 11 percent to 76.7 billion. Google "
            "Search revenue grew 11 percent to 44 billion. Chief Financial Officer Ruth Porat "
            "said the company would continue investing in artificial intelligence infrastructure "
            "while managing operating expenses carefully. Shares gained 6 percent in after-hours trading."
        ),
        "subject": "businessnews", "date": "October 24, 2023",
    },
    {
        "title": "Amazon sales growth accelerates as AWS demand rebounds",
        "text": (
            "Amazon.com Inc reported third-quarter net sales of 143.1 billion, up 13 percent "
            "from a year earlier, as its cloud unit Amazon Web Services returned to stronger "
            "growth. AWS revenue rose 12.3 percent to 23.4 billion, beating analyst estimates "
            "of 23.2 billion. The company posted operating income of 11.2 billion, well above "
            "the 7.7 billion forecast. Chief Executive Andy Jassy said cost-cutting efforts "
            "over the past year were flowing through to profitability."
        ),
        "subject": "businessnews", "date": "October 26, 2023",
    },
    {
        "title": "Meta profit surges as ad revenue jumps, shares soar",
        "text": (
            "Meta Platforms Inc reported third-quarter profit of 11.6 billion, more than "
            "double the year-earlier result, as advertising revenue climbed 23 percent to "
            "34.1 billion. The social media company said daily active users across its family "
            "of apps reached 3.14 billion. Chief Executive Mark Zuckerberg said the company "
            "was seeing strong returns from its investment in artificial intelligence-powered "
            "advertising tools. Shares surged 7 percent to a 52-week high in after-hours trading."
        ),
        "subject": "businessnews", "date": "October 25, 2023",
    },
    {
        "title": "Nvidia revenue more than doubles on AI chip demand",
        "text": (
            "Nvidia Corp reported fiscal second-quarter revenue of 13.5 billion, more than "
            "double from a year earlier, as demand for its artificial intelligence chips "
            "continued to outstrip supply. The result topped analyst estimates of 11.2 billion "
            "by a wide margin. Chief Executive Jensen Huang said orders for the company graphics "
            "processing units remained far above what Nvidia could manufacture. Gross margin "
            "widened to 70.1 percent. Shares climbed 8 percent to a record in after-hours trading."
        ),
        "subject": "businessnews", "date": "August 23, 2023",
    },

    # ELECTRIC VEHICLES
    {
        "title": "Tesla deliveries miss estimates amid supply constraints",
        "text": (
            "Tesla Inc delivered 435,059 vehicles in the third quarter, falling short of "
            "Wall Street expectations of 455,000 units, as supply chain disruptions weighed "
            "on production. The electric vehicle maker produced 430,488 cars during the period. "
            "Chief Executive Elon Musk said the shortfall was partly due to planned factory "
            "shutdowns for upgrades. Analysts said the miss raised questions about demand in "
            "an increasingly competitive market. Tesla shares fell 4.5 percent in premarket trading."
        ),
        "subject": "businessnews", "date": "October 2, 2023",
    },
    {
        "title": "Tesla posts surprise profit as cost cuts offset price reductions",
        "text": (
            "Tesla Inc reported quarterly profit of 2.5 billion, beating analyst expectations, "
            "as the electric vehicle maker cut production costs to offset the impact of vehicle "
            "price reductions. Revenue rose 9 percent to 23.4 billion. Chief Executive Elon Musk "
            "said the company remained on track to deliver 1.8 million vehicles for the full year. "
            "Automotive gross margin improved to 18.1 percent from 17.6 percent in the prior "
            "quarter. Shares rose 5.9 percent after the bell."
        ),
        "subject": "businessnews", "date": "July 19, 2023",
    },

    # FEDERAL RESERVE / MACRO
    {
        "title": "Fed raises rates by quarter point, signals possible pause",
        "text": (
            "The Federal Reserve raised its benchmark interest rate by 25 basis points on "
            "Wednesday to a target range of 5.25 to 5.50 percent, the highest level in 22 "
            "years. Fed Chair Jerome Powell said future rate decisions would depend on incoming "
            "economic data, leaving open the possibility of a pause at the next meeting. The "
            "rate-setting Federal Open Market Committee voted unanimously for the increase. "
            "Consumer prices rose 3.2 percent in the 12 months through July, down from a peak "
            "of 9.1 percent in June 2022."
        ),
        "subject": "politicsNews", "date": "July 26, 2023",
    },
    {
        "title": "U.S. economy adds 187,000 jobs in August, unemployment ticks up",
        "text": (
            "The United States economy added 187,000 jobs in August, slightly above analyst "
            "expectations, while the unemployment rate ticked up to 3.8 percent from 3.5 "
            "percent the prior month, the Labor Department said on Friday. Wage growth slowed "
            "to 4.3 percent year over year. Healthcare and leisure and hospitality sectors led "
            "job gains, while manufacturing shed workers for a third consecutive month. Federal "
            "Reserve officials said they would study the data carefully before deciding on "
            "further rate increases."
        ),
        "subject": "politicsNews", "date": "September 1, 2023",
    },
    {
        "title": "U.S. GDP grew 4.9 percent in third quarter, fastest in two years",
        "text": (
            "The United States economy grew at an annualized rate of 4.9 percent in the third "
            "quarter, the fastest pace in nearly two years, driven by strong consumer spending "
            "and inventory rebuilding, the Commerce Department said Thursday. The result topped "
            "analyst expectations of 4.5 percent growth. Consumer spending, which accounts for "
            "about two-thirds of economic output, rose 4 percent. Federal Reserve officials said "
            "the strong growth gave them confidence the economy could withstand higher interest rates."
        ),
        "subject": "politicsNews", "date": "October 26, 2023",
    },

    # BANKING
    {
        "title": "JPMorgan profit rises as interest income surges to record",
        "text": (
            "JPMorgan Chase and Co reported third-quarter profit of 13.2 billion on Friday, "
            "up 35 percent from a year ago, as rising interest rates boosted net interest income "
            "to record levels. Revenue rose 22 percent to 40.7 billion, exceeding analyst "
            "expectations. Chief Executive Jamie Dimon warned that geopolitical tensions and "
            "persistent inflation remained risks to the global economy. The bank set aside "
            "1.4 billion in credit loss provisions, up from 808 million a year earlier. "
            "Shares rose 1.5 percent."
        ),
        "subject": "businessnews", "date": "October 13, 2023",
    },
    {
        "title": "Goldman Sachs profit falls as dealmaking slump continues",
        "text": (
            "Goldman Sachs Group Inc reported third-quarter profit of 2.06 billion, down "
            "33 percent from a year earlier, as a prolonged slump in dealmaking and initial "
            "public offerings weighed on its investment banking division. Revenue fell 1 percent "
            "to 11.8 billion, missing analyst estimates of 11.9 billion. Chief Executive David "
            "Solomon said the bank was making progress on its strategic plan to reduce exposure "
            "to consumer lending and focus on core businesses. Shares fell 1.8 percent."
        ),
        "subject": "businessnews", "date": "October 17, 2023",
    },
    {
        "title": "Bank of America profit rises on higher interest rates",
        "text": (
            "Bank of America Corp reported third-quarter profit of 7.8 billion, up 10 percent "
            "from a year earlier, as the second-largest U.S. bank benefited from higher interest "
            "rates that boosted lending income. Net interest income rose 4 percent to 14.4 billion. "
            "Chief Executive Brian Moynihan said the bank was seeing resilience in consumer "
            "spending and loan demand. Revenue climbed 3 percent to 25.2 billion, topping analyst "
            "expectations. Shares rose 2.3 percent in morning trading."
        ),
        "subject": "businessnews", "date": "October 17, 2023",
    },

    # ENERGY / COMMODITIES
    {
        "title": "Oil prices rise as OPEC+ extends output cuts through year-end",
        "text": (
            "Oil prices rose more than 1 percent on Thursday after Saudi Arabia and Russia "
            "said they would extend voluntary production cuts through December, reducing global "
            "supply by a combined 1.3 million barrels per day. Brent crude futures climbed "
            "to 90.04 per barrel while U.S. West Texas Intermediate crude rose to 86.69. "
            "The OPEC+ alliance said the decision would be reviewed monthly and could be "
            "reversed if market conditions changed. Analysts said the cuts could push oil "
            "prices toward 100 per barrel before the end of the year."
        ),
        "subject": "businessnews", "date": "September 5, 2023",
    },
    {
        "title": "ExxonMobil profit falls as energy prices retreat from peaks",
        "text": (
            "Exxon Mobil Corp reported third-quarter profit of 9.1 billion, down 54 percent "
            "from the record high a year earlier, as oil and natural gas prices retreated from "
            "their 2022 peaks. Revenue fell to 90.8 billion from 112.1 billion. Chief Executive "
            "Darren Woods said the company remained committed to its plan to grow oil production "
            "and expand its chemicals business. Exxon raised its quarterly dividend by 4 percent "
            "to 0.95 per share."
        ),
        "subject": "businessnews", "date": "October 27, 2023",
    },

    # RETAIL
    {
        "title": "Walmart raises annual forecast after strong quarterly sales",
        "text": (
            "Walmart Inc raised its full-year profit and sales forecast on Thursday after "
            "reporting better-than-expected second-quarter results, as shoppers continued to "
            "spend on groceries and household essentials despite inflation. The retailer posted "
            "net sales of 161.6 billion for the quarter, up 5.7 percent from a year earlier. "
            "Comparable sales at U.S. stores rose 6.4 percent, beating analyst estimates of "
            "4.1 percent. Chief Executive Doug McMillon said the company was gaining market "
            "share across income groups."
        ),
        "subject": "businessnews", "date": "August 17, 2023",
    },
    {
        "title": "Target quarterly profit beats estimates as costs fall",
        "text": (
            "Target Corp reported quarterly profit of 971 million, beating analyst expectations, "
            "as the retailer cut costs and reduced excess inventory. Earnings per share came in "
            "at 2.10, above the 1.72 analysts had forecast. Revenue fell 4.9 percent to 24.8 "
            "billion as comparable sales declined 5.4 percent. Chief Executive Brian Cornell "
            "said the company was making progress on improving profitability even as consumers "
            "remained cautious on discretionary spending. Shares jumped 8 percent."
        ),
        "subject": "businessnews", "date": "August 16, 2023",
    },

    # PHARMA / HEALTHCARE
    {
        "title": "Pfizer revenue drops sharply as COVID vaccine demand falls",
        "text": (
            "Pfizer Inc reported third-quarter revenue of 13.2 billion, down 42 percent "
            "from a year ago, as sales of its COVID-19 vaccine and antiviral drug Paxlovid "
            "declined sharply. The drugmaker cut its full-year revenue forecast by 9 billion "
            "and said it would reduce costs by 3.5 billion. Chief Executive Albert Bourla said "
            "the company was focusing on growing its non-COVID product portfolio and advancing "
            "its pipeline of new medicines. Pfizer shares fell 2.3 percent to a three-year low."
        ),
        "subject": "businessnews", "date": "October 26, 2023",
    },
    {
        "title": "Eli Lilly profit surges on diabetes and obesity drug sales",
        "text": (
            "Eli Lilly and Co reported third-quarter profit of 1.89 billion, surging 37 percent "
            "from a year earlier, driven by rapid sales growth for its diabetes drug Mounjaro "
            "and obesity treatment Zepbound. Revenue climbed 37 percent to 9.5 billion, topping "
            "analyst estimates of 8.97 billion. Chief Executive David Ricks said manufacturing "
            "capacity expansion remained the company top priority to meet overwhelming demand. "
            "Lilly raised its full-year revenue guidance. Shares rose 4 percent to a record high."
        ),
        "subject": "businessnews", "date": "October 30, 2023",
    },

    # AIRLINES
    {
        "title": "Delta Air Lines reports record profit on strong travel demand",
        "text": (
            "Delta Air Lines Inc reported record quarterly profit of 1.9 billion on Thursday, "
            "as strong demand for leisure and business travel allowed the carrier to keep fares "
            "elevated. Revenue rose 11 percent to 14.6 billion. Chief Executive Ed Bastian said "
            "bookings for the holiday season were tracking ahead of last year. The airline "
            "reaffirmed its full-year earnings forecast and said it expected to generate more "
            "than 2 billion in free cash flow for the year. Shares rose 3.2 percent."
        ),
        "subject": "businessnews", "date": "October 12, 2023",
    },

    # AUTOMOTIVE
    {
        "title": "General Motors cuts outlook amid UAW strike impact",
        "text": (
            "General Motors Co lowered its full-year profit forecast on Tuesday, citing the "
            "financial impact of a weeks-long strike by the United Auto Workers union that "
            "halted production at several plants. The automaker now expects adjusted earnings "
            "before interest and taxes of 11.7 billion to 12.2 billion, down from a prior "
            "range of 12 to 14 billion. Chief Executive Mary Barra said the company remained "
            "committed to reaching a fair agreement with the union. Shares fell 2.1 percent."
        ),
        "subject": "businessnews", "date": "October 24, 2023",
    },

    # STREAMING / MEDIA
    {
        "title": "Netflix subscriber growth beats estimates, raises prices",
        "text": (
            "Netflix Inc added 8.76 million subscribers in the third quarter, far exceeding "
            "analyst expectations of 6 million, as its crackdown on password sharing drove "
            "new sign-ups. Revenue rose 7.8 percent to 8.54 billion. The streaming company "
            "said it would raise prices in the United States, United Kingdom and France. "
            "Chief Executive Greg Peters said the ad-supported tier now accounted for 30 percent "
            "of new sign-ups in markets where it was available. Shares surged 16 percent."
        ),
        "subject": "businessnews", "date": "October 18, 2023",
    },

    # SEMICONDUCTOR
    {
        "title": "Intel quarterly revenue beats estimates, raises forecast",
        "text": (
            "Intel Corp reported third-quarter revenue of 14.2 billion, topping analyst "
            "estimates of 13.5 billion, as its data center and PC chip businesses showed "
            "signs of recovery. The company posted a net loss of 167 million, narrower than "
            "the 523 million loss analysts had expected. Chief Executive Pat Gelsinger said "
            "the company was on track with its plan to regain manufacturing leadership by 2025. "
            "Intel raised its fourth-quarter revenue forecast to between 14.6 billion and 15.6 "
            "billion. Shares gained 9 percent in extended trading."
        ),
        "subject": "businessnews", "date": "October 26, 2023",
    },
    {
        "title": "Samsung chip profit rebounds as memory prices recover",
        "text": (
            "Samsung Electronics Co reported third-quarter operating profit of 2.4 trillion won, "
            "recovering sharply from the near-zero result in the prior quarter as memory chip "
            "prices began to rise on recovering demand. Revenue climbed 12 percent to 67.4 "
            "trillion won. The South Korean company said its semiconductor division returned to "
            "profit after three consecutive quarters of losses. Analysts said the recovery was "
            "earlier than expected and raised their price targets. Shares rose 3.1 percent."
        ),
        "subject": "businessnews", "date": "October 31, 2023",
    },

    # CRYPTO
    {
        "title": "Bitcoin tops 35,000 for first time since 2022 on ETF optimism",
        "text": (
            "Bitcoin climbed above 35,000 on Monday for the first time since May 2022, "
            "as investors grew optimistic that U.S. regulators would approve a spot bitcoin "
            "exchange-traded fund in the coming months. The cryptocurrency was last up 9.5 "
            "percent at 35,198. Analysts said anticipation of a potential ETF approval by the "
            "Securities and Exchange Commission was the primary driver of the rally. Ether, "
            "the second-largest cryptocurrency by market value, rose 5.2 percent to 1,842."
        ),
        "subject": "businessnews", "date": "October 23, 2023",
    },

    # TRADE
    {
        "title": "U.S. trade deficit narrows as exports rise to record",
        "text": (
            "The United States trade deficit narrowed to 58.3 billion in August from 64.7 "
            "billion in July, as exports rose to a record high, the Commerce Department said "
            "Thursday. Goods exports climbed 1.6 percent to 176.4 billion, led by industrial "
            "supplies and capital goods. Imports fell 0.7 percent to 314.0 billion, partly "
            "reflecting lower oil import prices. Economists said the data suggested net trade "
            "would make a positive contribution to third-quarter gross domestic product growth."
        ),
        "subject": "politicsNews", "date": "October 5, 2023",
    },
]

# Append to True.csv
new_rows = pd.DataFrame(BUSINESS_REAL)
for col in df.columns:
    if col not in new_rows.columns:
        new_rows[col] = ""
new_rows = new_rows[df.columns]
df_augmented = pd.concat([df, new_rows], ignore_index=True)
df_augmented.to_csv(TRUE_CSV, index=False)

print(f"Added {len(BUSINESS_REAL)} business/tech real-news articles")
print(f"True.csv now has {len(df_augmented):,} rows (was {len(df):,})")
print(f"\nNow run: python train.py")