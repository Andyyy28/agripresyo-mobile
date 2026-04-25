const en: Record<string, string> = {
  // Nav
  nav_market: 'Market', nav_shops: 'Shops', nav_analytics: 'Analytics', nav_profile: 'Profile', nav_dashboard: 'Dashboard',
  // Market
  greeting: 'Hello', search_commodities: 'Search commodities...', cat_all: 'All', cat_fruits: 'Fruits', cat_vegetables: 'Vegetables', cat_spices: 'Spices', cat_roots: 'Roots',
  sf_all: 'ALL', sf_price_up: '₱+', sf_price_down: '₱-', sf_high_demand: 'HIGH DEMAND', sf_top_gainer: 'TOP GAINER',
  my_watchlist: 'My Watchlist', items: 'ITEMS', item: 'ITEM', price_insights: 'Price Insights', results: 'results',
  in_season: 'IN SEASON', off_season: 'OFF SEASON', suggested_basket: 'Suggested Basket', best_value: 'Best Value Picks Within ₱1000', click_add_budget: 'Click to add to budget',
  // Smart Budget Planner
  smart_budget_planner: 'Smart Budget Planner', auto_calc: 'Auto-calculating unit weight vs market index values',
  liquidity: 'Liquidity', no_active_trades: 'No Active Trades', select_produce: 'Select produce from market to begin calculating',
  total_projected: 'Total Projected Commitment', inventory_liquidity: 'Inventory Liquidity Used', warning_exceeds: '⚠️ Projected cost exceeds available liquidity',
  qty: 'QTY',
  // Commodity Detail Modal
  local_market_index: 'Local Market Index', price_history: 'Price History', recent_data_points: 'Recent Data Points',
  available_terminals: 'Available Ask Terminals', no_vendors: 'No vendors available for this commodity',
  add_to_budget: 'Add to Budget Plan', close_view: 'Close View', added_to_budget: 'Added to Budget Plan',
  index_label: 'INDEX', projection_label: 'Projection', per_kg: '/ kg',
  // Profile
  profile: 'Profile', settings: 'Settings', notifications_label: 'Notifications', dark_mode: 'Dark Mode', language: 'Language', privacy: 'Privacy',
  on: 'On', off: 'Off', sign_out: 'Sign Out', consumer_label: 'Consumer', vendor_label: 'Vendor',
  saved: 'Saved', budget: 'Budget', lists: 'Lists',
  // Vendor Profile
  account: 'Account', name_label: 'Name', shop_name_label: 'Shop Name', email_label: 'Email', member_since: 'Member Since',
  commodities_sold: 'Commodities Sold', verified: 'Verified', pending: 'Pending',
  // Shops
  shops_title: 'Shops', browse_shops: 'Browse shops and find the best prices', filter_all: 'ALL', filter_fruits: 'FRUITS', filter_vegetables: 'VEGETABLES',
  fruit_shops: 'Fruit Shops', shops_sell_fruits: 'Shops that sell fruits', veg_spice_shops: 'Vegetable & Spice Shops', shops_sell_veg: 'Shops that sell vegetables and spices',
  new_market_partner: 'New Market Partner', view_shop: 'View Shop', open_status: 'OPEN', closed_status: 'CLOSED',
  // Analytics
  price_rankings: 'Price Rankings', see_expensive: 'See which products are most and least expensive right now',
  premium_fruits: 'Premium Fruits', value_fruits: 'Value Fruits', premium_veggies: 'Premium Veggies', value_veggies: 'Value Veggies',
  most_expensive: 'Most Expensive', most_affordable: 'Most Affordable', price_changes_time: 'Price Changes Over Time',
  period: 'Period', average: 'Average', range: 'Range', change: 'Change',
  // Budget page
  no_active_budget: 'No active trades. Select produce from market to begin.',
  // Insights
  insights_for_you: 'Insights for You', read_now: 'Read now', suggested_for_you: 'Suggested for you',
  // Notifications
  notifications_title: 'Notifications', mark_all_read: 'Mark all as read', no_notifications: 'No notifications', unread: 'unread',
  // Login
  login_subtitle: 'A Mobile App for Real-Time Market Prices.',
  consumer_desc: 'See prices and plan what to buy', vendor_desc: 'Manage your shop and update prices',
  email_placeholder: 'Email', password_placeholder: 'Password', access_terminal: 'Access Terminal', authenticating: 'Authenticating...',
  forgot_password: 'Forgot Password?', or_continue: 'Or Continue With', sign_in_google: 'Sign in with Google', sign_in_facebook: 'Sign in with Facebook',
  no_account: "Don't have an account?", sign_up: 'Sign Up', choose_account: 'Choose an account', continue_to: 'to continue to AgriPresyo',
  cancel: 'Cancel', continue_btn: 'Continue', connecting: 'Connecting...', continue_as: 'Continue as',
  login_failed: 'Login failed. Please try again.', fill_fields: 'Please fill in all fields.',
  // Signup
  create_account: 'Create Account', join_community: 'Join the AgriPresyo community today.',
  full_name: 'Full Name', confirm_password: 'Confirm Password', market_location: 'Market Location',
  create_terminal: 'Create Terminal', creating: 'Creating...', already_account: 'Already have an account?', log_in: 'Log In',
  // Onboarding
  welcome_greeting: 'Maligayang Pagdating', welcome_title_1: 'Welcome to', welcome_desc: 'Smarter farming decisions through real-time market updates. Track commodity prices across the Philippines.',
  live_price: 'Live Price Tracking', realtime_data: 'Real-Time Market Data', monitor_desc: 'Monitor commodity prices as they change. Never overpay or undersell again.',
  for_consumers: 'For Consumers', smart_buying: 'Smart Buying Starts Here', consumer_onboard_desc: 'Easily check market prices, compare commodities, and make smarter buying decisions.',
  view_realtime: 'View real-time prices', compare_vendors: 'Compare vendors easily', track_trends: 'Track market trends',
  for_vendors: 'For Vendors & Sellers', grow_business: 'Grow Your Business', vendor_onboard_desc: 'Manage your inventory, update product prices, and connect directly with consumers in your area.',
  manage_inventory: 'Manage inventory', update_prices: 'Update prices instantly', connect_consumers: 'Connect with consumers',
  lang_alerts: 'Language & Alerts', set_preferences: 'SET YOUR PREFERENCES', language_label: 'Language',
  stay_updated: 'Stay Updated with Price Alerts', alert_desc: 'Get notified when your tracked commodities hit your target price.',
  allow_notifications: 'Allow Notifications', not_now: 'Not Now',
  get_started: 'Get Started', next: 'Next', skip: 'Skip', continue_app: 'Continue to App',
  // Vendor Dashboard
  what_i_sell: 'What I Sell', demand: 'Demand', total_stock: 'Total Stock', fruit: 'Fruit', veggie: 'Veggie',
  bearish: 'BEARISH', caution_declining: 'Caution: Declining Prices',
  shop_profile: 'Shop Profile', edit: 'EDIT', save: 'SAVE', cancel_edit: 'CANCEL',
  shop_name_field: 'Shop Name', specialty_field: 'Specialty', location_field: 'Location', description_field: 'Description', market_hours: 'Market Hours',
  open_now: 'OPEN NOW',
  vendor_verification: 'Vendor Verification', verify_desc: 'Get verified to build trust with consumers',
  apply_verification: 'Apply for Verification', submit_verification: 'Submit Verification', submitting: 'Submitting...',
  verification_pending: 'Verification Pending', docs_submitted: "Documents submitted. We'll review within 3-5 business days.",
  verified_vendor: 'Verified Vendor', remove: 'Remove',
  terminal_admin: 'Terminal Admin', managing_assets: 'Managing Your Assets', report_issue: 'Report Issue', new_listing: 'New Listing',
  node_depleted: 'Node Inventory Depleted', init_listing: 'Initialize your first listing to begin trading', add_first: 'Add First Listing',
  inventory_count: 'Inventory', low_stock: 'Low Stock',
  edit_listing: 'Edit Listing', commodity_label: 'Commodity', price_per_kg: 'Price per kg', stock_label: 'Stock',
  availability: 'Availability', in_stock: 'In Stock', out_of_stock: 'Out of Stock', unit_label: 'Unit',
  save_listing: 'Save Listing', update_listing: 'Update Listing',
  shop_saved: 'Shop profile saved', complaint_submitted: 'Complaint submitted successfully',
  // Report
  report_subject: 'Subject', report_message: 'Message', subject_required: 'Subject is required', message_required: 'Message is required',
  confirm_report: 'Confirm Report', report_confirm_msg: 'Are you sure you want to submit this report?', go_back: 'Go Back', submit_report: 'Submit Report',
  // Vendor Inventory
  inventory_title: 'Inventory', products: 'Products', value: 'Value', current_stock: 'Current Stock', add_new: 'Add New',
  search_inventory: 'Search inventory...', product_name: 'Product Name', stock_kg: 'Stock (kg)', price_pkg: 'Price (₱/kg)',
  edit_product: 'Edit Product', add_product: 'Add New Product', update_product: 'Update Product', save_product: 'Save Product',
  // Vendor Notifications
  submit_concern: 'Submit a Concern', subject_line: 'Brief subject line...', category: 'Category',
  general_inquiry: 'General Inquiry', pricing_issue: 'Pricing Issue', technical_problem: 'Technical Problem', complaint: 'Complaint', suggestion: 'Suggestion',
  describe_concern: 'Describe your concern in detail...', submit_concern_btn: 'Submit Concern',
  concern_success: 'Concern submitted successfully!', concern_response: "We'll review and respond within 24 hours.",
  low_stock_warning: 'Low Stock Warning', price_update_recorded: 'Price Update Recorded', market_holiday: 'Market Holiday Notice',
  // Notification Panel
  mark_all: 'Mark all as read',
  // Per kilo
  per_kilo: 'per kilo',
};

const fil: Record<string, string> = {
  // Nav
  nav_market: 'Merkado', nav_shops: 'Mga Tindahan', nav_analytics: 'Pagsusuri', nav_profile: 'Profile', nav_dashboard: 'Dashboard',
  // Market
  greeting: 'Kamusta', search_commodities: 'Maghanap ng produkto...', cat_all: 'Lahat', cat_fruits: 'Prutas', cat_vegetables: 'Gulay', cat_spices: 'Pampalasa', cat_roots: 'Ugat',
  sf_all: 'LAHAT', sf_price_up: '₱+', sf_price_down: '₱-', sf_high_demand: 'MATAAS ANG DEMAND', sf_top_gainer: 'NANGUNGUNANG PAGTAAS',
  my_watchlist: 'Aking Listahan', items: 'MGA ITEM', item: 'ITEM', price_insights: 'Mga Insight sa Presyo', results: 'resulta',
  in_season: 'TAMANG PANAHON', off_season: 'LABAS SA PANAHON', suggested_basket: 'Mungkahing Basket', best_value: 'Pinakamahusay na Halaga sa Loob ng ₱1000', click_add_budget: 'I-click para idagdag sa badyet',
  // Smart Budget Planner
  smart_budget_planner: 'Smart Budget Planner', auto_calc: 'Awtomatikong pagkalkula ng timbang at halaga sa merkado',
  liquidity: 'Pondo', no_active_trades: 'Walang Aktibong Trades', select_produce: 'Pumili ng produkto mula sa merkado upang magsimula',
  total_projected: 'Kabuuang Inaasahang Gastos', inventory_liquidity: 'Ginamit na Pondo', warning_exceeds: '⚠️ Ang inaasahang gastos ay higit sa magagamit na pondo',
  qty: 'QTY',
  // Commodity Detail Modal
  local_market_index: 'Local na Index ng Merkado', price_history: 'Kasaysayan ng Presyo', recent_data_points: 'Mga Kamakailang Datos',
  available_terminals: 'Mga Available na Terminal', no_vendors: 'Walang available na nagbebenta para sa produktong ito',
  add_to_budget: 'Idagdag sa Budget Plan', close_view: 'Isara', added_to_budget: 'Naidagdag sa Budget Plan',
  index_label: 'INDEX', projection_label: 'Projection', per_kg: '/ kg',
  // Profile
  profile: 'Profile', settings: 'Mga Setting', notifications_label: 'Mga Abiso', dark_mode: 'Dark Mode', language: 'Wika', privacy: 'Privacy',
  on: 'Bukas', off: 'Sarado', sign_out: 'Mag-sign Out', consumer_label: 'Consumer', vendor_label: 'Vendor',
  saved: 'Na-save', budget: 'Badyet', lists: 'Mga Lista',
  // Vendor Profile
  account: 'Account', name_label: 'Pangalan', shop_name_label: 'Pangalan ng Tindahan', email_label: 'Email', member_since: 'Miyembro Mula',
  commodities_sold: 'Mga Ibinebentang Produkto', verified: 'Na-verify', pending: 'Pending',
  // Shops
  shops_title: 'Mga Tindahan', browse_shops: 'Mag-browse ng mga tindahan at hanapin ang pinakamahusay na presyo', filter_all: 'LAHAT', filter_fruits: 'PRUTAS', filter_vegetables: 'GULAY',
  fruit_shops: 'Mga Tindahan ng Prutas', shops_sell_fruits: 'Mga tindahan na nagbebenta ng prutas', veg_spice_shops: 'Mga Tindahan ng Gulay at Pampalasa', shops_sell_veg: 'Mga tindahan na nagbebenta ng gulay at pampalasa',
  new_market_partner: 'Bagong Partner sa Merkado', view_shop: 'Tingnan ang Tindahan', open_status: 'BUKAS', closed_status: 'SARADO',
  // Analytics
  price_rankings: 'Mga Ranggo ng Presyo', see_expensive: 'Tingnan kung aling mga produkto ang pinakamahal at pinakamurang ngayon',
  premium_fruits: 'Premium na Prutas', value_fruits: 'Abot-kayang Prutas', premium_veggies: 'Premium na Gulay', value_veggies: 'Abot-kayang Gulay',
  most_expensive: 'Pinakamahal', most_affordable: 'Pinaka-abot-kaya', price_changes_time: 'Mga Pagbabago ng Presyo sa Paglipas ng Panahon',
  period: 'Panahon', average: 'Karaniwan', range: 'Saklaw', change: 'Pagbabago',
  // Budget page
  no_active_budget: 'Walang aktibong trade. Pumili ng produkto mula sa merkado.',
  // Insights
  insights_for_you: 'Mga Insight Para sa Iyo', read_now: 'Basahin', suggested_for_you: 'Mungkahi para sa iyo',
  // Notifications
  notifications_title: 'Mga Abiso', mark_all_read: 'Markahan lahat bilang nabasa', no_notifications: 'Walang abiso', unread: 'hindi pa nabasa',
  // Login
  login_subtitle: 'Isang Mobile App para sa Real-Time na Presyo sa Merkado.',
  consumer_desc: 'Tingnan ang mga presyo at planuhin ang bibilhin', vendor_desc: 'Pamahalaan ang iyong tindahan at i-update ang mga presyo',
  email_placeholder: 'Email', password_placeholder: 'Password', access_terminal: 'Pumasok', authenticating: 'Nagpapatunay...',
  forgot_password: 'Nakalimutan ang Password?', or_continue: 'O Magpatuloy Sa', sign_in_google: 'Mag-sign in gamit ang Google', sign_in_facebook: 'Mag-sign in gamit ang Facebook',
  no_account: 'Wala ka pang account?', sign_up: 'Mag-sign Up', choose_account: 'Pumili ng account', continue_to: 'para magpatuloy sa AgriPresyo',
  cancel: 'Kanselahin', continue_btn: 'Magpatuloy', connecting: 'Kumokonekta...', continue_as: 'Magpatuloy bilang',
  login_failed: 'Hindi makapag-login. Subukan muli.', fill_fields: 'Pakipunan ang lahat ng field.',
  // Signup
  create_account: 'Gumawa ng Account', join_community: 'Sumali sa komunidad ng AgriPresyo ngayon.',
  full_name: 'Buong Pangalan', confirm_password: 'Kumpirmahin ang Password', market_location: 'Lokasyon ng Merkado',
  create_terminal: 'Gumawa ng Terminal', creating: 'Gumagawa...', already_account: 'May account ka na?', log_in: 'Mag-log In',
  // Onboarding
  welcome_greeting: 'Maligayang Pagdating', welcome_title_1: 'Maligayang pagdating sa', welcome_desc: 'Mas matalinong desisyon sa pagsasaka sa pamamagitan ng real-time na update sa merkado. Subaybayan ang presyo ng mga produkto sa buong Pilipinas.',
  live_price: 'Live na Pagsubaybay ng Presyo', realtime_data: 'Real-Time na Datos ng Merkado', monitor_desc: 'Subaybayan ang presyo ng mga produkto habang nagbabago. Huwag nang mag-overpay o mag-undersell.',
  for_consumers: 'Para sa mga Consumer', smart_buying: 'Matalinong Pamimili Dito Nagsisimula', consumer_onboard_desc: 'Madaling suriin ang presyo sa merkado, ikumpara ang mga produkto, at gumawa ng mas matalinong desisyon sa pamimili.',
  view_realtime: 'Tingnan ang real-time na presyo', compare_vendors: 'Ikumpara ang mga nagbebenta', track_trends: 'Subaybayan ang mga trend sa merkado',
  for_vendors: 'Para sa mga Nagbebenta', grow_business: 'Palaguin ang Iyong Negosyo', vendor_onboard_desc: 'Pamahalaan ang iyong imbentaryo, i-update ang presyo ng produkto, at direktang kumonekta sa mga consumer.',
  manage_inventory: 'Pamahalaan ang imbentaryo', update_prices: 'I-update kaagad ang presyo', connect_consumers: 'Kumonekta sa mga consumer',
  lang_alerts: 'Wika at Mga Abiso', set_preferences: 'ITAKDA ANG IYONG MGA KAGUSTUHAN', language_label: 'Wika',
  stay_updated: 'Manatiling Updated sa Mga Alerto ng Presyo', alert_desc: 'Maabisuhan kapag ang iyong sinusubaybayan na produkto ay umabot sa target na presyo.',
  allow_notifications: 'Payagan ang mga Abiso', not_now: 'Hindi Ngayon',
  get_started: 'Magsimula', next: 'Susunod', skip: 'Laktawan', continue_app: 'Magpatuloy sa App',
  // Vendor Dashboard
  what_i_sell: 'Ang Aking Benta', demand: 'Demand', total_stock: 'Kabuuang Stock', fruit: 'Prutas', veggie: 'Gulay',
  bearish: 'PABABA', caution_declining: 'Babala: Bumababang Presyo',
  shop_profile: 'Profile ng Tindahan', edit: 'I-EDIT', save: 'I-SAVE', cancel_edit: 'KANSELAHIN',
  shop_name_field: 'Pangalan ng Tindahan', specialty_field: 'Espesyalidad', location_field: 'Lokasyon', description_field: 'Deskripsyon', market_hours: 'Oras ng Merkado',
  open_now: 'BUKAS NGAYON',
  vendor_verification: 'Beripikasyon ng Vendor', verify_desc: 'Mag-verify para magtayo ng tiwala sa mga consumer',
  apply_verification: 'Mag-apply para sa Beripikasyon', submit_verification: 'Isumite ang Beripikasyon', submitting: 'Isinusumite...',
  verification_pending: 'Pending ang Beripikasyon', docs_submitted: 'Naisumite ang mga dokumento. Susuriin sa loob ng 3-5 araw ng negosyo.',
  verified_vendor: 'Na-verify na Vendor', remove: 'Alisin',
  terminal_admin: 'Terminal Admin', managing_assets: 'Pamamahala ng Iyong mga Asset', report_issue: 'Mag-report ng Isyu', new_listing: 'Bagong Listahan',
  node_depleted: 'Walang Laman ang Imbentaryo', init_listing: 'Magsimula ng iyong unang listahan para magsimulang mag-trade', add_first: 'Idagdag ang Unang Listahan',
  inventory_count: 'Imbentaryo', low_stock: 'Mababang Stock',
  edit_listing: 'I-edit ang Listahan', commodity_label: 'Produkto', price_per_kg: 'Presyo bawat kg', stock_label: 'Stock',
  availability: 'Availability', in_stock: 'May Stock', out_of_stock: 'Walang Stock', unit_label: 'Unit',
  save_listing: 'I-save ang Listahan', update_listing: 'I-update ang Listahan',
  shop_saved: 'Na-save ang profile ng tindahan', complaint_submitted: 'Matagumpay na naisumite ang reklamo',
  // Report
  report_subject: 'Paksa', report_message: 'Mensahe', subject_required: 'Kinakailangan ang paksa', message_required: 'Kinakailangan ang mensahe',
  confirm_report: 'Kumpirmahin ang Report', report_confirm_msg: 'Sigurado ka bang gusto mong isumite ang report na ito?', go_back: 'Bumalik', submit_report: 'Isumite ang Report',
  // Vendor Inventory
  inventory_title: 'Imbentaryo', products: 'Mga Produkto', value: 'Halaga', current_stock: 'Kasalukuyang Stock', add_new: 'Magdagdag',
  search_inventory: 'Maghanap sa imbentaryo...', product_name: 'Pangalan ng Produkto', stock_kg: 'Stock (kg)', price_pkg: 'Presyo (₱/kg)',
  edit_product: 'I-edit ang Produkto', add_product: 'Magdagdag ng Bagong Produkto', update_product: 'I-update ang Produkto', save_product: 'I-save ang Produkto',
  // Vendor Notifications
  submit_concern: 'Magsumite ng Concern', subject_line: 'Maikling linya ng paksa...', category: 'Kategorya',
  general_inquiry: 'Pangkalahatang Katanungan', pricing_issue: 'Isyu sa Presyo', technical_problem: 'Teknikal na Problema', complaint: 'Reklamo', suggestion: 'Mungkahi',
  describe_concern: 'Ilarawan ang iyong concern nang detalyado...', submit_concern_btn: 'Isumite ang Concern',
  concern_success: 'Matagumpay na naisumite ang concern!', concern_response: 'Susuriin at sasagutin sa loob ng 24 na oras.',
  low_stock_warning: 'Babala sa Mababang Stock', price_update_recorded: 'Naitala ang Update sa Presyo', market_holiday: 'Abiso sa Holiday ng Merkado',
  // Notification Panel
  mark_all: 'Markahan lahat bilang nabasa',
  // Per kilo
  per_kilo: 'bawat kilo',
};

export const translations: Record<string, Record<string, string>> = { en, fil };
