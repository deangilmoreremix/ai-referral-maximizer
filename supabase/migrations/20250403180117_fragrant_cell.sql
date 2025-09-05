/*
  # RPC Functions for Analytics and User Management

  1. New Functions
    - `get_user_action_counts` - Get action counts for a user with time filtering
    - `get_popular_content_types` - Get most popular content types across all users
    - `refresh_all_materialized_views` - Refresh all materialized views
*/

-- Create function to get action counts for a user with time filtering
CREATE OR REPLACE FUNCTION get_user_action_counts(user_id_param UUID, time_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  action TEXT,
  count BIGINT
) LANGUAGE plpgsql AS $$
BEGIN
  IF time_filter IS NULL THEN
    RETURN QUERY
    SELECT ul.action, COUNT(*) as count
    FROM usage_logs ul
    WHERE ul.user_id = user_id_param
    GROUP BY ul.action
    ORDER BY count DESC;
  ELSE
    RETURN QUERY
    SELECT ul.action, COUNT(*) as count
    FROM usage_logs ul
    WHERE ul.user_id = user_id_param
      AND ul.created_at >= NOW() - time_filter::INTERVAL
    GROUP BY ul.action
    ORDER BY count DESC;
  END IF;
END;
$$;

-- Create function to get popular content types with filters
CREATE OR REPLACE FUNCTION get_popular_content_types(limit_param INTEGER DEFAULT 10, category_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  usage_count BIGINT,
  unique_users BIGINT
) LANGUAGE plpgsql AS $$
BEGIN
  IF category_filter IS NULL THEN
    RETURN QUERY
    SELECT 
      ct.id, 
      ct.name, 
      ct.category, 
      COUNT(gc.id) AS usage_count,
      COUNT(DISTINCT gc.user_id) AS unique_users
    FROM content_types ct
    LEFT JOIN generated_content gc ON ct.id = gc.content_type_id
    GROUP BY ct.id, ct.name, ct.category
    ORDER BY COUNT(gc.id) DESC
    LIMIT limit_param;
  ELSE
    RETURN QUERY
    SELECT 
      ct.id, 
      ct.name, 
      ct.category, 
      COUNT(gc.id) AS usage_count,
      COUNT(DISTINCT gc.user_id) AS unique_users
    FROM content_types ct
    LEFT JOIN generated_content gc ON ct.id = gc.content_type_id
    WHERE ct.category = category_filter
    GROUP BY ct.id, ct.name, ct.category
    ORDER BY COUNT(gc.id) DESC
    LIMIT limit_param;
  END IF;
END;
$$;

-- Create function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS INTEGER AS $$
DECLARE
  view_count INTEGER := 0;
  view_record RECORD;
BEGIN
  FOR view_record IN 
    SELECT matviewname 
    FROM pg_matviews 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'REFRESH MATERIALIZED VIEW ' || view_record.matviewname;
    view_count := view_count + 1;
  END LOOP;
  
  RETURN view_count;
END;
$$ LANGUAGE plpgsql;