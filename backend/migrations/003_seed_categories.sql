INSERT INTO news_categories (name, description) VALUES
('Macro', 'Broad economic indicators, central bank policies, and global market trends.'),
('Geopolitical', 'International relations, trade wars, conflicts, and political stability.'),
('Sector-Specific', 'Industry-wide developments affecting specific market sectors.'),
('Earnings/Corporate', 'Company financial reports, mergers, acquisitions, and executive changes.'),
('Legal/Regulatory', 'Court rulings, new laws, and regulatory actions affecting businesses.'),
('Innovation/Tech', 'Breakthrough technologies, R&D milestones, and digital transformation.')
ON CONFLICT (name) DO NOTHING;
