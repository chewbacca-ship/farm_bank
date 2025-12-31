const { query } = require('./db');


async function seedOpportunities() {
  const opportunities = [
    {
      title: "Organic Wheat Farm Expansion",
      category: "Crops",
      risk_level: "Medium",
      description: "Invest in expanding organic wheat production across 500 acres of premium farmland.",
      expected_return: 73.0,
      duration_months: 20,
      min_investment: 10000.00,
      funding_goal: 500000.00,
      key_highlights: "Certified organic, Long-term contracts, Sustainable farming",
      location: "Saskatchewan, Canada 🇨🇦",
      icon: "Sprout"
    },
    {
      title: "Premium Beef Cattle Ranch",
      category: "Livestock",
      risk_level: "Medium-High",
      description: "Partner with established ranchers to raise premium grass-fed beef cattle.",
      expected_return: 30.0,
      duration_months: 24,
      min_investment: 15000.00,
      funding_goal: 600000.00,
      key_highlights: "Grass-fed, Hormone-free, Regenerative grazing",
      location: "Queensland, Australia 🇦🇺",
      icon: "Beef"
    },
    {
      title: "Biodynamic Vineyard & Winery",
      category: "Wine",
      risk_level: "Medium-High",
      description: "Establish a vineyard producing biodynamic wines with global export potential.",
      expected_return: 50.0,
      duration_months: 30,
      min_investment: 20000.00,
      funding_goal: 750000.00,
      key_highlights: "Biodynamic-certified, Eco-tourism potential, Premium wine demand",
      location: "Tuscany, Italy 🇮🇹",
      icon: "WineIcon"
    },
    {
      title: "Regenerative Almond Orchard",
      category: "Tree Crops",
      risk_level: "Medium",
      description: "Develop a pesticide-free almond orchard using biodynamic soil practices.",
      expected_return: 70.0,
      duration_months: 22,
      min_investment: 12000.00,
      funding_goal: 400000.00,
      key_highlights: "Water-efficient irrigation, Pollinator-friendly, High export demand",
      location: "Andalusia, Spain 🇪🇸",
      icon: "Nut"
    },
    {
      title: "Medicinal Herb Greenhouse",
      category: "AgriTech",
      risk_level: "Medium",
      description: "Expand greenhouses for biodynamic medicinal herbs such as lavender, chamomile, and turmeric.",
      expected_return: 55.0,
      duration_months: 18,
      min_investment: 8000.00,
      funding_goal: 350000.00,
      key_highlights: "Wellness & pharmaceutical demand, Year-round cultivation, Biodynamic-certified",
      location: "Kerala, India 🇮🇳",
      icon: "Leaf"
    },
    {
      title: "Organic Dairy & Cheese Cooperative",
      category: "Dairy",
      risk_level: "Medium",
      description: "Support a cooperative producing biodynamic milk and artisanal cheese.",
      expected_return: 60.0,
      duration_months: 26,
      min_investment: 18000.00,
      funding_goal: 550000.00,
      key_highlights: "Animal welfare, Farm-to-table distribution, Premium dairy products",
      location: "Bavaria, Germany 🇩🇪",
      icon: "MilkIcon"
    },
    {
      title: "Iowa Farmland Investment Trust",
      category: "Farmland",
      risk_level: "Low-Medium",
      description: "Acquire and lease premium farmland in Iowa's most productive agricultural regions.",
      expected_return: 66.0,
      duration_months: 36,
      min_investment: 250000.00,
      funding_goal: 1000000.00,
      key_highlights: "Stable land value, Consistent lease income, Low-risk farmland asset",
      location: "Iowa, United States 🇺🇸",
      icon: "LandPlot"
    },
    {
      title: "Vertical Farming Technology",
      category: "AgTech",
      risk_level: "High",
      description: "Invest in cutting-edge vertical farming facilities producing leafy greens year-round.",
      expected_return: 44.0,
      duration_months: 28,
      min_investment: 30000.00,
      funding_goal: 900000.00,
      key_highlights: "Controlled-environment agriculture, Year-round supply, High scalability",
      location: "Singapore 🇸🇬",
      icon: "Building"
    }
  ];

  try {
    console.log("⏳ Clearing and seeding investment opportunities...");

    // Clear table first
    await query("TRUNCATE TABLE investment_opportunities RESTART IDENTITY CASCADE");

    // Insert all opportunities
    for (const opp of opportunities) {
      await query(
        `
        INSERT INTO investment_opportunities 
        (title, category, risk_level, description, expected_return, duration_months, 
         min_investment, funding_goal, key_highlights, location, icon)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `,
        [
          opp.title,
          opp.category,
          opp.risk_level,
          opp.description,
          opp.expected_return,
          opp.duration_months,
          opp.min_investment,
          opp.funding_goal,
          opp.key_highlights,
          opp.location,
          opp.icon
        ]
      );
    }

    console.log("✅ Investment opportunities seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding opportunities:", err);
  } finally {
    process.exit();
  }
}

seedOpportunities();
