// DA curriculum transcribed from D:/website/js/script.js.
// Unit titles, subtitles and topic lists retain the supplied source content.
export const productOverview = {
  "key": "analyst",
  "practiceQuestions": 2200,
  "modules": 8,
  "resources": 24,
  "units": 77,
  "topics": 637,
  "samples": {
    "handbook": { "title": "BI Handbook", "file": "BI-handbook-v2.pdf", "label": "handbook", "subject": "Business Intelligence" },
    "workbook": { "title": "BI Workbook", "file": "BI-workbook-v2.pdf", "label": "workbook", "subject": "Business Intelligence" },
    "solutions": { "title": "BI Solutions", "file": "BI-solution-v2.pdf", "label": "solutions", "subject": "Business Intelligence" }
  }
};

export const curriculum = [
  {
    "number": 1,
    "title": "Mathematics & Statistics",
    "units": [
      {
        "title": "Descriptive Statistics",
        "subtitle": "Summarizing & Describing Data",
        "topics": [
          "Mean, Median & Mode",
          "Trimmed & Winsorized Mean",
          "Measures of Spread: Range & Interquartile Range",
          "Variance & Standard Deviation",
          "Skewness & Kurtosis",
          "Percentiles, Quartiles & Deciles",
          "Z-scores & Standardisation",
          "Histograms & Box Plots",
          "Frequency & Contingency Tables",
          "QQ Plots & Shape Visualisation"
        ]
      },
      {
        "title": "Probability Foundations",
        "subtitle": "",
        "topics": [
          "Sample Spaces & Events",
          "Classical, Empirical & Subjective Probability",
          "Kolmogorov Axioms",
          "Addition & Multiplication Rules",
          "Conditional Probability P(A|B)",
          "Law of Total Probability",
          "Permutations & Combinations",
          "Probability Trees & Venn Diagrams",
          "Expected Value E(X) & Variance Var(X)",
          "Moment Generating Functions"
        ]
      },
      {
        "title": "Probability Distributions",
        "subtitle": "",
        "topics": [
          "Bernoulli & Binomial Distributions",
          "Poisson & Geometric Distributions",
          "Negative Binomial & Hypergeometric Distributions",
          "Uniform & Exponential Distributions",
          "Gamma, Beta & Log-Normal Distributions",
          "Student's t-Distribution",
          "Chi-Square & F-Distribution",
          "Distribution Relationships",
          "Distribution Selection Framework",
          "Fitting & Mixture Distributions"
        ]
      },
      {
        "title": "Normal Distribution",
        "subtitle": "",
        "topics": [
          "Definition & Parameters (μ, σ)",
          "Standard Normal Distribution Z~N(0,1)",
          "Empirical Rule (68-95-99.7)",
          "Normal PDF & CDF",
          "Z-score Interpretation",
          "Finding Areas Under the Curve",
          "Inverse Normal (Quantile Function)",
          "QQ Plots & Shapiro-Wilk Test",
          "Bivariate & Multivariate Normal Distribution",
          "Transformations to Achieve Normality"
        ]
      },
      {
        "title": "Central Limit Theorem",
        "subtitle": "",
        "topics": [
          "Law of Large Numbers (Weak & Strong)",
          "Sampling Distributions",
          "Standard Error (SE)",
          "Bias-Variance of Estimators",
          "CLT Formal Statement",
          "Proof Intuition via MGFs",
          "Berry-Esseen Theorem",
          "CLT for Proportions",
          "CLT in Practice — Required Sample Size",
          "Finite Population Correction & Delta Method"
        ]
      },
      {
        "title": "Hypothesis Testing",
        "subtitle": "",
        "topics": [
          "Null & Alternative Hypotheses (H₀, H₁)",
          "Type I Error (α) — False Positive",
          "Type II Error (β) — False Negative",
          "Power (1−β) & p-value",
          "One-Sample z-test & t-test",
          "Independent & Paired Samples t-test",
          "Chi-Square Goodness of Fit & Independence",
          "Cohen’s d & Effect Size",
          "Sample Size Calculation",
          "Bonferroni Correction & FDR"
        ]
      },
      {
        "title": "Confidence Intervals",
        "subtitle": "",
        "topics": [
          "Point vs Interval Estimation",
          "Correct Interpretation of CIs",
          "Margin of Error",
          "CI for Population Mean (z-interval)",
          "CI for Population Mean (t-interval)",
          "CI for Proportion",
          "CI for Variance (Chi-Square)",
          "CI for Difference of Two Means",
          "Bootstrap Confidence Intervals",
          "Bayesian Credible Intervals"
        ]
      },
      {
        "title": "A/B Testing",
        "subtitle": "",
        "topics": [
          "Randomised Controlled Experiments",
          "Control vs Treatment Groups & Randomisation Unit",
          "Minimum Detectable Effect (MDE)",
          "Sample Size Calculation & Experiment Duration",
          "Statistical Significance in A/B Tests",
          "The Peeking Problem",
          "Sequential Testing & Always-Valid p-values",
          "Network Effects & Interference",
          "Multi-Armed Bandit Algorithms",
          "Bayesian A/B Testing & Multivariate Testing"
        ]
      },
      {
        "title": "Correlation & Regression",
        "subtitle": "",
        "topics": [
          "Pearson, Spearman & Kendall Correlation",
          "Partial Correlation & Correlation vs Causation",
          "OLS — Ordinary Least Squares",
          "R-squared & Adjusted R-squared",
          "Residual Analysis & Influential Points",
          "Multiple Linear Regression",
          "Multicollinearity & VIF",
          "Regularisation — Ridge & Lasso",
          "Logistic Regression",
          "Model Evaluation Metrics"
        ]
      },
      {
        "title": "Bayes Theorem Basics",
        "subtitle": "",
        "topics": [
          "Bayes’ Formula Derivation",
          "Prior, Likelihood & Posterior",
          "Bayesian Updating",
          "Bayes vs Frequentist Paradigm",
          "Beta-Binomial & Gamma-Poisson Conjugacy",
          "Normal-Normal Conjugacy",
          "Non-Conjugate Priors & MCMC",
          "Naive Bayes Classifier",
          "Bayesian Hypothesis Testing",
          "Credible Intervals vs Confidence Intervals"
        ]
      },
      {
        "title": "Analysis of Variance (ANOVA)",
        "subtitle": "",
        "topics": [
          "One-Way ANOVA",
          "F-Statistic & F-Distribution",
          "Assumptions of ANOVA",
          "Post-Hoc Tests (Tukey & Bonferroni)",
          "Two-Way ANOVA",
          "Interaction Effects",
          "Repeated Measures ANOVA",
          "ANCOVA — Analysis of Covariance",
          "Non-Parametric Alternatives (Kruskal-Wallis)",
          "ANOVA in Python"
        ]
      },
      {
        "title": "Time Series Statistics",
        "subtitle": "",
        "topics": [
          "Time Series Components (Trend, Seasonality, Noise)",
          "Stationarity & Differencing",
          "Autocorrelation (ACF) & Partial Autocorrelation (PACF)",
          "Moving Averages & Smoothing",
          "AR, MA & ARMA Models",
          "ARIMA & Seasonal ARIMA (SARIMA)",
          "Augmented Dickey-Fuller Test",
          "Exponential Smoothing (Holt-Winters)",
          "Forecasting Accuracy Metrics",
          "Time Series in Python"
        ]
      }
    ],
    "topics": 120
  },
  {
    "number": 2,
    "title": "Excel & Google Sheets",
    "units": [
      {
        "title": "The Foundation",
        "subtitle": "Data Cleaning & Validation",
        "topics": [
          "Text functions: TRIM, CLEAN, PROPER, LEN",
          "Extracting with LEFT, RIGHT, MID, FIND",
          "SUBSTITUTE & REPLACE for text fixes",
          "Flash Fill for pattern-based extraction",
          "Finding & removing duplicate records",
          "Data validation: dropdowns, date & number rules",
          "IFERROR, IFNA & ISERROR for error handling",
          "Standardizing date & number formats",
          "Auditing tools: trace precedents & dependents",
          "Basic math & descriptive stats: SUM, AVERAGE, COUNT"
        ]
      },
      {
        "title": "Connecting Data",
        "subtitle": "VLOOKUP, XLOOKUP, INDEX-MATCH",
        "topics": [
          "VLOOKUP syntax: exact vs approximate match",
          "Troubleshooting #N/A & #REF errors",
          "INDEX-MATCH: why it beats VLOOKUP",
          "XLOOKUP: spill results & multiple columns",
          "Two-way lookup with nested MATCH",
          "Wildcard lookups with * and ?",
          "Lookup across multiple sheets / workbooks",
          "HLOOKUP & horizontal lookups",
          "Handling missing values in lookups",
          "Modern best practice: Why XLOOKUP is the new standard"
        ]
      },
      {
        "title": "Summarizing at Scale",
        "subtitle": "Pivot Tables & Charts",
        "topics": [
          "Building your first pivot table",
          "Row, column, value & filter fields",
          "Grouping dates (months/quarters), numbers & text",
          "Calculated fields & items",
          "Slicers & timelines for interactivity",
          "Pivot charts & chart type selection",
          "GETPIVOTDATA function",
          "Refresh strategies & data source changes",
          "Pivot table layouts: Compact vs Tabular",
          "Top 10 filters inside Pivots"
        ]
      },
      {
        "title": "Modern Logic",
        "subtitle": "Dynamic Arrays & SUMPRODUCT",
        "topics": [
          "Understanding \"Spill\" logic in modern Excel",
          "Dynamic arrays: FILTER, SORT, UNIQUE",
          "SEQUENCE & RANDARRAY functions",
          "SUMPRODUCT for multi-criteria aggregation",
          "SUMIFS vs SUMPRODUCT compared",
          "BYROW, BYCOL, MAP, REDUCE (The Lambda functions)",
          "The # operator for spill ranges",
          "LET and LAMBDA for creating custom formulas",
          "CHOOSECOLS and CHOOSEROWS",
          "Legacy arrays vs Dynamic arrays"
        ]
      },
      {
        "title": "The Engine",
        "subtitle": "Power Query / ETL",
        "topics": [
          "Power Query editor walkthrough",
          "Importing: CSV, Excel, web & databases",
          "Data type detection & transformation",
          "Filtering, sorting & grouping rows",
          "Merge queries (joins) & append queries (stacking)",
          "Unpivoting columns (converting wide data to tall)",
          "Custom & conditional columns",
          "M language basics for advanced transforms",
          "Query refresh & dependency management",
          "Parameters in Power Query"
        ]
      },
      {
        "title": "Visual Communication",
        "subtitle": "Conditional Formatting",
        "topics": [
          "Highlight cell rules (greater than, duplicates)",
          "Data bars & color scales",
          "Icon sets for KPI indicators",
          "Custom formula-based rules (The \"secret sauce\")",
          "Cross-column conditional formatting",
          "Heat maps for correlation matrices",
          "Managing & prioritizing rule order",
          "Using formatting to find data entry errors",
          "Dynamic formatting based on Slicer selection",
          "Checkboxes and conditional formatting logic"
        ]
      },
      {
        "title": "Deep Analytics",
        "subtitle": "Statistical Functions",
        "topics": [
          "Descriptive stats: MEDIAN, MODE, STDEV",
          "Population vs Sample variance",
          "PERCENTILE, QUARTILE & IQR calculation",
          "CORREL & COVAR for correlation analysis",
          "Linear regression with LINEST",
          "SLOPE, INTERCEPT & R-squared",
          "FORECAST.ETS for time-series prediction",
          "Data Analysis ToolPak: ANOVA, t-Test, Histogram",
          "Weighted averages using SUMPRODUCT",
          "Probability distributions (NORM.DIST)"
        ]
      },
      {
        "title": "Output & UX",
        "subtitle": "Dashboard Design",
        "topics": [
          "Dashboard layout & UX principles",
          "Dynamic named ranges for live charts",
          "KPI cards with conditional formatting",
          "Sparklines for inline trend visualization",
          "Linking charts & slicers dynamically",
          "Form controls: dropdowns, scroll bars, buttons",
          "Camera tool & linked picture technique",
          "Protecting sheets & locking dashboard cells",
          "Print setup & PDF export",
          "Color theory for professional reports"
        ]
      },
      {
        "title": "Google Sheets Specialization",
        "subtitle": "",
        "topics": [
          "QUERY function: SQL-style data queries in Sheets",
          "IMPORTRANGE & cross-sheet connections",
          "ARRAYFORMULA for auto-expanding formulas",
          "Collaboration, sharing & version history",
          "GOOGLEFINANCE for live market data",
          "SPARKLINE function (more powerful in Sheets)",
          "FILTER and SORT differences vs Excel",
          "Google Apps Script: JavaScript-based automation",
          "Custom functions for Sheets",
          "Looker Studio integration for live dashboards"
        ]
      },
      {
        "title": "High-Level Automation",
        "subtitle": "Excel VBA",
        "topics": [
          "Recording & running macros",
          "VBA editor (Alt+F11) overview",
          "Sub procedures vs Functions",
          "Variables, data types & scope",
          "Loops: For, For Each, Do While",
          "Working with Range, Cells & Sheets objects",
          "If-Else and Select Case logic",
          "Event-driven macros (Worksheet_Change)",
          "Debugging: breakpoints & watch window",
          "Saving as .xlsm macro-enabled workbook"
        ]
      }
    ],
    "topics": 100
  },
  {
    "number": 3,
    "title": "SQL & Databases",
    "units": [
      {
        "title": "The Core Foundation",
        "subtitle": "SELECT, WHERE, ORDER BY",
        "topics": [
          "Basic SELECT syntax: columns & aliases",
          "SELECT DISTINCT to remove duplicates",
          "Filtering rows with WHERE clause",
          "Comparison operators: =, <>, >, <, >=, <=",
          "Logical operators: AND, OR, NOT",
          "BETWEEN, IN, and NOT IN filters",
          "Wildcard filtering with LIKE (%, _)",
          "Sorting results with ORDER BY (ASC / DESC)",
          "Limiting results: LIMIT, TOP, FETCH NEXT",
          "Column aliasing with AS"
        ]
      },
      {
        "title": "Reality Check",
        "subtitle": "NULL Handling & Type Casting",
        "topics": [
          "What NULL means: unknown vs empty",
          "IS NULL and IS NOT NULL filters",
          "COALESCE to replace NULLs with defaults",
          "NULLIF to convert a value into NULL",
          "CAST and CONVERT for explicit type conversion",
          "TRY_CAST and TRY_CONVERT for safe conversions",
          "Implicit vs explicit type casting pitfalls",
          "ISNULL and NVL: dialect-specific alternatives",
          "NULLs in math: what happens when you add 5 to NULL?",
          "Handling NULLs in logical conditions"
        ]
      },
      {
        "title": "Summarizing Data",
        "subtitle": "GROUP BY & Aggregations",
        "topics": [
          "Aggregate functions: SUM, COUNT, AVG, MIN, MAX",
          "GROUP BY syntax and how it works",
          "Filtering grouped results with HAVING",
          "WHERE vs HAVING: key differences",
          "COUNT(*) vs COUNT(column) vs COUNT(DISTINCT)",
          "Grouping by multiple columns",
          "ROLLUP for subtotals & grand totals",
          "CUBE for multi-dimensional aggregations",
          "GROUPING SETS for custom aggregation levels",
          "NULLs in aggregate functions: what gets ignored?"
        ]
      },
      {
        "title": "Combining Data Horizontally",
        "subtitle": "JOINs",
        "topics": [
          "Understanding relational JOIN logic",
          "INNER JOIN: matching rows only",
          "LEFT JOIN: all left rows + matched right rows",
          "RIGHT JOIN: all right rows + matched left rows",
          "FULL OUTER JOIN: all rows from both tables",
          "CROSS JOIN: cartesian product use cases",
          "SELF JOIN: joining a table to itself",
          "Joining on multiple conditions",
          "Joining more than two tables",
          "Common JOIN mistakes & NULLs in results"
        ]
      },
      {
        "title": "Combining Data Vertically",
        "subtitle": "Set Operations",
        "topics": [
          "What are set operations and when to use them",
          "UNION to combine results from two queries",
          "UNION vs UNION ALL: duplicates & performance",
          "INTERSECT to find common rows between queries",
          "EXCEPT / MINUS to find rows in one but not another",
          "Column count & data type rules for set operations",
          "Ordering results from set operations",
          "Using set operations vs JOINs: when each fits",
          "Stacking multiple result sets for reporting",
          "Real-world use case: comparing daily snapshots"
        ]
      },
      {
        "title": "Advanced Logic",
        "subtitle": "Subqueries & CTEs",
        "topics": [
          "What is a subquery and where to use it",
          "Subqueries in SELECT (scalar subqueries)",
          "Subqueries in WHERE (filtering with results)",
          "Subqueries in FROM (derived tables)",
          "Correlated vs non-correlated subqueries",
          "EXISTS and NOT EXISTS operators",
          "CTE syntax with the WITH clause",
          "Multiple CTEs in a single query",
          "Recursive CTEs for hierarchical data",
          "CTEs vs subqueries: readability & performance"
        ]
      },
      {
        "title": "Professional Analysis",
        "subtitle": "Window Functions",
        "topics": [
          "What are window functions and OVER clause",
          "PARTITION BY to define window groups",
          "ORDER BY inside OVER for row ordering",
          "ROW_NUMBER for unique sequential ranking",
          "RANK and DENSE_RANK: handling ties",
          "NTILE for bucketing rows into groups",
          "LAG to access previous row values",
          "LEAD to access next row values",
          "FIRST_VALUE and LAST_VALUE in a window",
          "Running totals & moving averages (ROWS BETWEEN)"
        ]
      },
      {
        "title": "Custom Logic & Cleaning",
        "subtitle": "CASE, Dates, Strings",
        "topics": [
          "CASE WHEN syntax (Simple vs Searched)",
          "CASE WHEN inside aggregates (Pivot logic)",
          "Date data types and current date functions",
          "EXTRACT, DATEDIFF, and DATE_TRUNC",
          "String manipulation: CONCAT, SUBSTRING, TRIM",
          "String searching: CHARINDEX, LIKE, REGEX",
          "Splitting and replacing strings",
          "Building dynamic labels and categories",
          "Handling time zones in analytics",
          "Formatting data for final reports"
        ]
      },
      {
        "title": "Performance & Scale",
        "subtitle": "Optimization & Cloud",
        "topics": [
          "How indexes work (Clustered vs Non-clustered)",
          "Reading execution plans (EXPLAIN ANALYZE)",
          "Identifying full table scans vs index seeks",
          "SARGable vs non-SARGable conditions",
          "BigQuery & Redshift architecture",
          "Partitioned & clustered tables in the cloud",
          "Cost management: bytes billed & dry runs",
          "Distribution keys and sort keys",
          "Loading data: GCS/S3 to Cloud SQL",
          "Scheduled queries & materialized views"
        ]
      },
      {
        "title": "Building Systems",
        "subtitle": "Procedures, Views & Design",
        "topics": [
          "Creating, replacing & dropping Views",
          "Materialized views and refresh strategies",
          "Stored procedure syntax and structure",
          "Input/Output parameters and variables",
          "Transactions: COMMIT and ROLLBACK",
          "Normalization (1NF, 2NF, 3NF)",
          "Denormalization for analytics performance",
          "Star schema: fact & dimension tables",
          "Entity-Relationship (ER) diagrams",
          "Choosing data types for storage efficiency"
        ]
      }
    ],
    "topics": 100
  },
  {
    "number": 4,
    "title": "Python for Analytics",
    "units": [
      {
        "title": "Python Fundamentals for Analytics",
        "subtitle": "",
        "topics": [
          "Variables, Constants, and PEP 8 Naming Conventions",
          "Primitive Data Types: String, Integer, Float, Boolean",
          "String Manipulation: f-strings, .strip(), .split(), .replace()",
          "Type Casting and Checking (type(), isinstance())",
          "Mathematical Operators & Order of Operations",
          "Logical Operators (and, or, not) and Membership (in)",
          "Conditional Logic: if, elif, else",
          "Comparison Operators for Data Filtering"
        ]
      },
      {
        "title": "Data Structures & Iteration",
        "subtitle": "The Logic",
        "topics": [
          "Lists: Slicing, appending, and list methods",
          "Dictionaries: Key-value pairs for JSON-like data",
          "Sets & Tuples: Unique values and immutability",
          "For Loops: Iterating through lists and dictionaries",
          "While Loops: Logic-based iteration",
          "List Comprehensions: Writing \"Pythonic\" one-liners for data transformation",
          "Dictionary Comprehensions: Transforming mapping data",
          "Nested structures: Lists of dictionaries (the standard API format)"
        ]
      },
      {
        "title": "Functions & Error Handling",
        "subtitle": "",
        "topics": [
          "Defining Functions: def, arguments, and return",
          "Positional vs. Keyword arguments",
          "Lambda Functions: Anonymous functions for quick data mapping",
          "Scope: Local vs. Global variables",
          "Error Handling: try, except, finally to prevent script crashes",
          "Importing modules (import math, import os)",
          "Understanding __name__ == \"__main__\"",
          "Documentation: Writing Docstrings for collaborative code"
        ]
      },
      {
        "title": "NumPy",
        "subtitle": "The Foundation of Data",
        "topics": [
          "The ndarray: Why it's faster than Python lists",
          "Array creation: np.array(), np.zeros(), np.arange(), np.linspace()",
          "Vectorization: Performing math on entire columns without loops",
          "Broadcasting: How NumPy handles different array shapes",
          "Universal Functions (ufuncs): np.exp(), np.sqrt(), np.log()",
          "Slicing and Masking: Filtering data using Boolean arrays",
          "Aggregations: np.sum(), np.mean(), np.std(), np.median()",
          "Reshaping and Transposing data"
        ]
      },
      {
        "title": "pandas",
        "subtitle": "Core DataFrame Operations",
        "topics": [
          "Series vs. DataFrames: The 1D and 2D structures",
          "Data I/O: Reading and writing CSV, Excel, and JSON",
          "Inspection: .head(), .info(), .describe(), .shape",
          "Indexing: Selecting data with .loc (labels) and .iloc (positions)",
          "Conditional Filtering: Selecting rows based on multiple criteria",
          "Column Operations: Renaming, dropping, and creating new features",
          "Sorting: .sort_values() and .sort_index()",
          "Setting and Resetting Indexes"
        ]
      },
      {
        "title": "pandas",
        "subtitle": "Advanced Wrangling",
        "topics": [
          "Merging: pd.merge() (Inner, Left, Right, Outer joins)",
          "Concatenation: pd.concat() (Stacking data vertically or horizontally)",
          "Groupby: Split-Apply-Combine logic",
          "Aggregation: .agg(['mean', 'sum', 'count'])",
          "Pivot Tables and Cross-tabulations (pd.pivot_table())",
          "Transform & Filter: Advanced Groupby operations",
          "Multi-indexing: Handling complex, hierarchical data",
          "Apply: Using custom functions on rows/columns with .apply() and .map()"
        ]
      },
      {
        "title": "The Data Cleaning Protocol",
        "subtitle": "",
        "topics": [
          "Identifying and handling Missing Data: .isnull(), .dropna(), .fillna()",
          "Imputation strategies: Mean, Median, and Mode vs. Forward-fill",
          "Data Type Conversion: .astype() and pd.to_datetime()",
          "Handling Duplicates: .duplicated() and .drop_duplicates()",
          "String Cleaning in DataFrames: .str accessor methods",
          "Outlier Detection: Z-score and IQR (Interquartile Range) methods",
          "Regex for Data Cleaning: Using re module to fix messy patterns",
          "Standardizing units and category labels"
        ]
      },
      {
        "title": "Data Collection",
        "subtitle": "APIs & Scraping",
        "topics": [
          "The requests library: GET and POST requests",
          "JSON Parsing: Converting API responses into DataFrames",
          "Authentication: Working with API Keys and Headers",
          "Web Scraping Basics: Introduction to BeautifulSoup",
          "Inspecting HTML: Tags, Classes, and IDs",
          "Scraping tables and lists into pandas",
          "Handling Pagination: Scraping across multiple pages",
          "Ethical Scraping: robots.txt and rate limiting"
        ]
      },
      {
        "title": "Static Visualization",
        "subtitle": "Matplotlib & Seaborn",
        "topics": [
          "The Object-Oriented Interface: fig, ax = plt.subplots()",
          "Customizing Plots: Titles, Labels, Legends, and Colors",
          "Basic Plots: Line, Bar, Scatter, and Pie",
          "Statistical Viz (Seaborn): sns.histplot, sns.kdeplot, sns.boxplot",
          "Categorical Viz: sns.violinplot, sns.stripplot, sns.countplot",
          "Regression Plots: sns.regplot and sns.lmplot",
          "Relationship Grids: sns.pairplot and sns.heatmap",
          "Visualization Best Practices: Data-ink ratio and choosing the right chart"
        ]
      },
      {
        "title": "Interactive Viz & Dashboards",
        "subtitle": "Plotly & Streamlit",
        "topics": [
          "Interactive Scatter and Line plots with Plotly Express",
          "Adding Interactivity: Hover data, Sliders, and Buttons",
          "Geographic Maps: Choropleths and Scatter Geo",
          "Streamlit Fundamentals: st.write(), st.sidebar, st.columns",
          "Input Widgets: Selectboxes, Sliders, and File Uploaders",
          "Integrating pandas with Streamlit for live filtering",
          "Displaying charts and DataFrames in a web app",
          "Deploying a Python Dashboard to the Cloud"
        ]
      },
      {
        "title": "Exploratory Data Analysis",
        "subtitle": "EDA & Stats",
        "topics": [
          "Descriptive Statistics: Central tendency and dispersion",
          "Skewness and Kurtosis: Understanding distribution shapes",
          "Correlation: Pearson vs. Spearman coefficients",
          "Hypothesis Testing: Null vs. Alternative hypothesis",
          "T-Tests: One-sample, Independent, and Paired",
          "ANOVA: Comparing means across three or more groups",
          "Chi-Square Test for Independence (Categorical data)",
          "P-values and Significance levels (α = 0.05)"
        ]
      },
      {
        "title": "Predictive Modeling",
        "subtitle": "Regression",
        "topics": [
          "Introduction to Scikit-Learn: The fit-predict API",
          "Simple Linear Regression: OLS (Ordinary Least Squares)",
          "Multiple Linear Regression: Handling multiple features",
          "Assumptions of Linear Regression (Normality, Homoscedasticity)",
          "Logistic Regression: Sigmoid function and binary classification",
          "Model Evaluation (Regression): R², MAE, MSE, RMSE",
          "Model Evaluation (Classification): Confusion Matrix, Precision, Recall, F1-Score",
          "Train-Test Split and Cross-Validation"
        ]
      },
      {
        "title": "Time Series Analysis",
        "subtitle": "",
        "topics": [
          "Handling Datetime objects: pd.to_datetime() and .dt accessor",
          "Resampling and Frequency Conversion (.resample('M'), .asfreq())",
          "Window Functions: Rolling means and Expanding windows",
          "Time Shifting: .shift() and .diff() for growth rates",
          "Seasonality and Trend decomposition",
          "Handling Time Zones and Daylight Savings",
          "Visualizing Time Series: Seasonal subseries plots",
          "Basic Forecasting: Autocorrelation (ACF) and Moving Averages"
        ]
      },
      {
        "title": "Unsupervised Learning",
        "subtitle": "Clustering",
        "topics": [
          "Introduction to Unsupervised Learning vs. Supervised",
          "K-Means Clustering: How the algorithm works",
          "Choosing K: The Elbow Method and Silhouette Score",
          "Data Scaling: Why StandardScaler is required for clustering",
          "Principal Component Analysis (PCA) for Dimensionality Reduction",
          "Interpreting Cluster Centroids and Labels",
          "Hierarchical Clustering (Dendrograms)",
          "Real-world Case Study: Customer Segmentation"
        ]
      }
    ],
    "topics": 112
  },
  {
    "number": 5,
    "title": "Business Intelligence & Dashboards",
    "units": [
      {
        "title": "Dashboard Design & UX Strategy",
        "subtitle": "",
        "topics": [
          "Defining KPIs: Lead vs. Lag indicators",
          "The 5-Second Rule: Information hierarchy in layouts",
          "Visual Perception: Gestalt principles (Proximity, Similarity, Enclosure)",
          "Color Theory: Using color for emphasis, not decoration",
          "Choosing the Right Chart: Comparison vs. Composition vs. Trend",
          "User Stories: Defining “Who” the dashboard is for",
          "Interactivity Design: Drill-downs vs. Tooltips vs. Page Navigation",
          "Handling “Request Bloat”: How to say no to unnecessary charts"
        ]
      },
      {
        "title": "BI Data Modeling",
        "subtitle": "The Star Schema",
        "topics": [
          "Relational Modeling for BI: Fact tables vs. Dimension tables",
          "Star Schema vs. Snowflake Schema: Why Star is king for BI",
          "Primary Keys and Foreign Keys in a BI context",
          "Cardinality: One-to-Many vs. Many-to-Many relationships",
          "Normalization vs. Denormalization for performance",
          "Handling Slowly Changing Dimensions (SCD Type 1 and Type 2)",
          "Designing a “Date Table” (The backbone of all time-analysis)",
          "ISNULL and NVL: dialect-specific alternatives",
          "NULLs in math: what happens when you add 5 to NULL?",
          "Handling NULLs in logical conditions"
        ]
      },
      {
        "title": "Power BI Desktop Fundamentals",
        "subtitle": "Track A: Power BI",
        "topics": [
          "Get Data: Connecting to SQL, Excel, and Web",
          "Power Query (M Language) for BI-specific cleaning",
          "Building the Relationship View: Active vs. Inactive relationships",
          "Creating basic visuals: Cards, Tables, and Matrixes",
          "Slicers and Syncing Slicers across pages",
          "Using the “Selection Pane” for conditional layouts",
          "Custom Visuals from the AppSource marketplace",
          "CUBE for multi-dimensional aggregations",
          "GROUPING SETS for custom aggregation levels",
          "NULLs in aggregate functions: what gets ignored?"
        ]
      },
      {
        "title": "DAX",
        "subtitle": "Data Analysis Expressions",
        "topics": [
          "Calculated Columns vs. Measures: When to use which",
          "The “Golden Rule”: Row Context vs. Filter Context",
          "CALCULATE(): The most powerful function in Power BI",
          "Time Intelligence: SAMEPERIODLASTYEAR, YTD, MTD",
          "Iterator Functions: SUMX, AVERAGEX, RANKX",
          "Variables (VAR) for readability and performance",
          "DAX Studio for debugging and optimization",
          "Joining on multiple conditions",
          "Joining more than two tables",
          "Common JOIN mistakes & NULLs in results"
        ]
      },
      {
        "title": "Power BI Service & Governance",
        "subtitle": "Track A: Power BI",
        "topics": [
          "Publishing Workspaces: My Workspace vs. Pro Workspaces",
          "Gateway Configuration: Setting up automatic data refreshes",
          "Creating Power BI “Apps” for end-users",
          "Row-Level Security (RLS): Static vs. Dynamic",
          "Creating Dashboards vs. Reports (The technical difference)",
          "Usage Metrics: Seeing who actually uses your reports",
          "Ordering results from set operations",
          "Using set operations vs JOINs: when each fits",
          "Stacking multiple result sets for reporting",
          "Real-world use case: comparing daily snapshots"
        ]
      },
      {
        "title": "Tableau Basics & Data Architecture",
        "subtitle": "Track B: Tableau",
        "topics": [
          "Connecting to data: Live vs. Extract (Performance trade-offs)",
          "Blue Pills vs. Green Pills: Dimensions vs. Measures",
          "Discrete vs. Continuous data logic",
          "Building the “Worksheet”: Marks Card, Shelves, and Pages",
          "The “Order of Operations” in Tableau (The Filter Pipeline)",
          "Groups, Sets, and Bins",
          "CTE syntax with the WITH clause",
          "Multiple CTEs in a single query",
          "Recursive CTEs for hierarchical data",
          "CTEs vs subqueries: readability & performance"
        ]
      },
      {
        "title": "Advanced Tableau",
        "subtitle": "LODs & Interactivity",
        "topics": [
          "Calculated Fields: String, Date, and Logic functions",
          "LOD Expressions: FIXED, INCLUDE, EXCLUDE",
          "Parameters: Creating “What-if” scenarios and dynamic toggles",
          "Dashboard Actions: Filter, Highlight, and URL actions",
          "Map Layers and Spatial Analysis",
          "Device Designer: Making dashboards for Mobile vs. Desktop",
          "Tableau Public vs. Tableau Cloud deployment",
          "LEAD to access next row values",
          "FIRST_VALUE and LAST_VALUE in a window",
          "Running totals & moving averages (ROWS BETWEEN)"
        ]
      },
      {
        "title": "Looker Studio",
        "subtitle": "Track C: Lightweight / Marketing BI",
        "topics": [
          "Native Google Connectors: Sheets, Ads, GA4, BigQuery",
          "Data Blending: Joining sources without a warehouse",
          "Calculated Fields in Looker Studio",
          "Building Interactive Controls (Dropdowns, Date ranges)",
          "Report Sharing and Automated Email Scheduling",
          "String searching: CHARINDEX, LIKE, REGEX",
          "Splitting and replacing strings",
          "Building dynamic labels and categories",
          "Handling time zones in analytics",
          "Formatting data for final reports"
        ]
      },
      {
        "title": "Looker & LookML",
        "subtitle": "Modern Enterprise BI",
        "topics": [
          "Looker’s unique architecture: Why it’s “Code-First”",
          "LookML Basics: Dimensions, Measures, and Views",
          "The Model File: Scoping explores and joins",
          "Version Control: Using Git with Looker",
          "Liquid Parameters for dynamic SQL generation",
          "Persistent Derived Tables (PDTs) for performance",
          "Cost management: bytes billed & dry runs",
          "Distribution keys and sort keys",
          "Loading data: GCS/S3 to Cloud SQL",
          "Scheduled queries & materialized views"
        ]
      },
      {
        "title": "KPI Tracking & The Metrics Layer",
        "subtitle": "",
        "topics": [
          "Building a “Data Dictionary” for stakeholders",
          "Metric Consistency: Ensuring “Revenue” means the same thing everywhere",
          "Alerting: Setting up “Threshold Alerts” for business owners",
          "User Acceptance Testing (UAT): How to verify data with users",
          "Maintenance: Handling “Schema Drift” when source data changes",
          "Normalization (1NF, 2NF, 3NF)",
          "Denormalization for analytics performance",
          "Star schema: fact & dimension tables",
          "Entity-Relationship (ER) diagrams",
          "Choosing data types for storage efficiency"
        ]
      }
    ],
    "topics": 98
  },
  {
    "number": 6,
    "title": "Data Engineering Fundamentals",
    "units": [
      {
        "title": "Data Integration",
        "subtitle": "ELT & ETL",
        "topics": [
          "ETL vs. ELT: Why modern cloud stacks prefer Extract-Load-Transform",
          "Batch vs. Real-time processing: When to use which",
          "Change Data Capture (CDC): How databases sync only new/updated rows",
          "Managed Connectors: Using Fivetran, Airbyte, or Stitch to automate ingestion",
          "API Ingestion: Understanding how data is pulled from SaaS tools (Salesforce, Zendesk)",
          "File-based Ingestion: Handling CSV, Parquet, and Avro files"
        ]
      },
      {
        "title": "Storage Architecture",
        "subtitle": "Lakes, Warehouses & Lakehouses",
        "topics": [
          "Data Warehouse: Structured storage for BI (BigQuery, Snowflake)",
          "Data Lake: Unstructured storage for raw data (AWS S3, Google Cloud Storage)",
          "The Data Lakehouse: The “best of both worlds” (Databricks, Iceberg)",
          "Object Storage vs. Block Storage: Understanding S3/GCS buckets",
          "Storage Formats: Row-based (CSV) vs. Columnar (Parquet) performance"
        ]
      },
      {
        "title": "Cloud Data Warehousing",
        "subtitle": "The Big Four",
        "topics": [
          "Google BigQuery: Serverless architecture and “Querying the Web”",
          "Snowflake: Separation of Storage and Compute; Data Sharing features",
          "AWS S3 + Athena: “Query-on-the-fly” logic for data lakes",
          "Azure Synapse: Integrating Power BI with Enterprise DW",
          "Cost Management: Understanding “Slot” usage, “Compute Credits,” and “Scan costs”"
        ]
      },
      {
        "title": "Analytics Engineering with dbt",
        "subtitle": "Data Build Tool",
        "topics": [
          "The dbt Workflow: Developing, Testing, and Documenting",
          "Models & Modular SQL: Breaking complex queries into smaller, reusable pieces",
          "Materializations: Views vs. Tables vs. Incremental models",
          "Version Control: Basics of Git (Commit, Push, Pull Request) for analysts",
          "Jinja & Macros: Using Python-like logic inside SQL to automate code",
          "Lineage: Understanding how data flows from Raw to Product tables"
        ]
      },
      {
        "title": "Orchestration & Automation",
        "subtitle": "Airflow",
        "topics": [
          "The DAG (Directed Acyclic Graph): Understanding pipeline dependencies",
          "Scheduling: Cron jobs and interval-based triggers",
          "Task Failures & Retries: How pipelines recover from errors",
          "Operators & Sensors: Logic for waiting for a file to arrive before running SQL",
          "Airflow vs. dbt Cloud: Choosing the right tool for automation"
        ]
      },
      {
        "title": "Schema Design & Data Modeling",
        "subtitle": "",
        "topics": [
          "Star Schema: Fact tables and Dimension tables",
          "Slowly Changing Dimensions (SCD)",
          "Denormalization: Why cloud warehouses prefer wide tables over complex joins",
          "Surrogate Keys: Generating unique IDs for warehouse records",
          "Partitioning & Clustering: How to organize tables to save money on queries"
        ]
      },
      {
        "title": "Data Quality, Reliability & Observability",
        "subtitle": "",
        "topics": [
          "Data Validation: Using dbt tests for Uniqueness and Not-Null constraints",
          "Freshness Alerts: Detecting when data hasn’t been updated in 24 hours",
          "Schema Evolution: What happens when a source column name changes?",
          "Anomalies: Detecting sudden spikes or drops in record counts",
          "Data Documentation: Maintaining a Data Dictionary for the business"
        ]
      },
      {
        "title": "Advanced Data Patterns",
        "subtitle": "Streaming & Privacy",
        "topics": [
          "Streaming Basics: Kafka and Pub/Sub (Real-time events)",
          "Lambda vs. Kappa Architecture: Handling both historical and live data",
          "Data Privacy (GDPR/CCPA): Masking PII (Personally Identifiable Information)",
          "Data Access Control: Administering roles and permissions in the warehouse"
        ]
      }
    ],
    "topics": 41
  },
  {
    "number": 7,
    "title": "Storytelling, Communication & Domain Knowledge",
    "units": [
      {
        "title": "Problem Framing & The Art of the Question",
        "subtitle": "",
        "topics": [
          "The “5 Whys” Technique: Digging past the surface request to find the true business pain",
          "Converting Business Problems into Data",
          "Defining Success Metrics: Setting clear KPIs before the analysis begins",
          "Stakeholder Interviewing: How to run a discovery session",
          "Identifying Constraints: Data availability, time sensitivity, and budget"
        ]
      },
      {
        "title": "Narrative Design",
        "subtitle": "The Story Arc",
        "topics": [
          "The ABT Framework: “And, But, Therefore” for quick data summaries",
          "The SCQA Framework: Situation, Complication, Question, Answer",
          "Choosing the Protagonist: Is the “Hero” the customer, the product, or the company?",
          "Managing the “Climax”: Leading the audience toward the most important insight",
          "The “Actionable Ending”: Ensuring every story ends with a clear “Next Step”"
        ]
      },
      {
        "title": "Visual Communication & Slide Design",
        "subtitle": "",
        "topics": [
          "Preattentive Attributes: Using color, size, and orientation to guide the eye",
          "Eliminating “Chart Junk”: Maximizing the data-to-ink ratio",
          "The “Blink Test”: Can a stakeholder understand the slide in 5 seconds?",
          "Effective Annotation: Using callouts and titles to tell the user what to think",
          "Executive Slide Layouts: The “Z-Pattern” and “F-Pattern” of reading",
          "Choosing “Insight over Information”: When to use a table vs. a chart"
        ]
      },
      {
        "title": "Stakeholder Management & Oral Delivery",
        "subtitle": "",
        "topics": [
          "Translating Tech-to-English: Explaining P-values or Co-efficients to a Marketing Manager",
          "Handling “Bad News”: How to present data that shows a project failed",
          "Managing The Q&A: What to do when you don’t know the answer",
          "Adapting to the Audience: Presenting to C-Suite vs. Peer Analysts",
          "The “Executive Summary” Pitch: Delivering a 2-minute “Elevator Version” of your 40-page report"
        ]
      },
      {
        "title": "Professional Writing & Documentation",
        "subtitle": "",
        "topics": [
          "Writing for Scannability: Bullet points, bold text, and headers",
          "The Executive Summary: Writing the one-pager everyone actually reads",
          "Documentation (READMEs): Explaining your methodology so other analysts can reproduce it",
          "Data Ethics & Transparency: Disclosing data limitations and biases",
          "Professional Slack/Email Communication: How to share a quick insight without a full deck"
        ]
      },
      {
        "title": "Domain Specialization",
        "subtitle": "Choose Your Track",
        "topics": [
          "Track A: E-Commerce & Retail",
          "Track B: SaaS & Subscription",
          "Track C: Marketing & Growth",
          "Track D: FinTech & BFSI",
          "Track E: Healthcare & BioTech"
        ]
      }
    ],
    "topics": 31
  },
  {
    "number": 8,
    "title": "AI-Era Analytics",
    "units": [
      {
        "title": "Advanced Prompt Engineering for Analytics",
        "subtitle": "",
        "topics": [
          "The Analytical Persona: Crafting prompts that force the AI to act as a Senior Data Scientist",
          "Chain-of-Thought (CoT) Prompting: Forcing LLMs to explain their logic step-by-step to reduce math errors",
          "Few-Shot Learning: Providing examples of your schema and “Gold Standard” SQL to improve AI output",
          "Delimiters & Structured Output: Getting AI to return data in specific formats (JSON, Markdown, Python dictionaries)",
          "Iterative Debugging: How to talk back to an AI when it gives you a hallucinated column name"
        ]
      },
      {
        "title": "AI-Assisted Development",
        "subtitle": "SQL & Python",
        "topics": [
          "Copilot Mastery: Using GitHub Copilot, Cursor, or ChatGPT Canvas for real-time coding",
          "Refactoring & Optimization: Using AI to turn “spaghetti SQL” into clean, SARGable queries",
          "Auto-Documentation: Using AI to write dbt descriptions and Python docstrings",
          "The “Rubber Duck” Method: Using LLMs to explain complex legacy code you inherited",
          "Unit Testing with AI: Generating edge-case data to test if your Python functions break"
        ]
      },
      {
        "title": "AI-Powered Exploratory Data Analysis",
        "subtitle": "EDA",
        "topics": [
          "PandasAI & Sketch: Natural language interfaces for Python DataFrames",
          "Automated Insight Discovery: Using AI to find anomalies or correlations you might have missed",
          "Qualitative Data at Scale: Using LLMs to categorize and sentiment-tag thousands of customer reviews in seconds",
          "Synthetic Data Generation: Creating “fake but realistic” datasets for privacy-safe testing",
          "Visualization Suggestions: Asking AI to choose the best chart based on the data distribution"
        ]
      },
      {
        "title": "The AI-Ready Semantic Layer",
        "subtitle": "NL2SQL",
        "topics": [
          "What is a Semantic Layer?: Centralizing metrics so the AI knows exactly what “Revenue” means",
          "Metadata Management: Naming columns and tables so an LLM can understand them",
          "dbt Semantic Layer & Cube: Implementing a metrics layer that AI can query",
          "Vector Databases (Basics): How RAG (Retrieval-Augmented Generation) helps AI find the right documentation",
          "NL2SQL Interfaces: Setting up “Chat with your Data” for non-technical stakeholders"
        ]
      },
      {
        "title": "AutoML & Low-Code Predictive Analytics",
        "subtitle": "",
        "topics": [
          "AutoML Overview: Using tools like PyCaret or Google Vertex AI to build models without writing the math",
          "Feature Importance: Using AI to tell you which variables actually drive your KPIs",
          "Automated Hyperparameter Tuning: Letting the machine find the best “settings” for your model",
          "Model Interpretation: Using SHAP or LIME (assisted by AI) to explain why a prediction was made",
          "From Analyst to “Citizen Data Scientist”: When to stop and hand it over to a Machine Learning Engineer"
        ]
      },
      {
        "title": "AI Ethics, Trust & Governance",
        "subtitle": "",
        "topics": [
          "The Hallucination Trap: Strategies for “Verifying the Bot” (The “Always Be Checking” rule)",
          "Data Privacy: Understanding PII (Personally Identifiable Information) and safe LLM usage",
          "AI Bias Detection: Identifying if your AutoML model is discriminating against certain groups",
          "Governance Frameworks: Managing “Shadow AI” (unauthorized tool usage) in the workplace",
          "The “Human in the Loop”: Why AI provides the draft, but the Analyst provides the decision"
        ]
      },
      {
        "title": "Agentic Workflows",
        "subtitle": "The Future of the Role",
        "topics": [
          "Introduction to Agents: AI that can use tools (SQL, Python, Web Search) in a sequence",
          "Building a Research Agent: Automating the collection of market data and competitor pricing",
          "Multi-Step Pipelines: Setting up an AI to “Run SQL → Clean in Python → Write Slack Summary”",
          "The Orchestration Layer: Basics of LangChain or AutoGen for data tasks",
          "Prompt Versioning: Treating your AI prompts like code (Git for Prompts)"
        ]
      }
    ],
    "topics": 35
  }
];
