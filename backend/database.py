from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client (uses HTTPS — works on any network)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_db() -> Client:
    """Dependency that provides the Supabase client."""
    return supabase


def check_db_connection() -> bool:
    """Test database connectivity via Supabase REST API."""
    try:
        result = supabase.table("users").select("id").limit(1).execute()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
