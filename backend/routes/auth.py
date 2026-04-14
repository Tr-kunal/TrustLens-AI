from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from postgrest.exceptions import APIError
from database import get_db
from schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse
from services.auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Client = Depends(get_db)):
    """Register a new user account."""
    user_data = {
        "name": request.name,
        "email": request.email,
        "password_hash": hash_password(request.password),
        "role": "user"
    }

    try:
        result = db.table("users").insert(user_data).execute()
    except APIError as e:
        if e.code == "23505":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

    user = result.data[0]
    access_token = create_access_token(data={"sub": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Client = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    result = db.table("users").select("*").eq("email", request.email).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = result.data[0]
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/logout")
def logout():
    """
    Logout endpoint. Since JWT is stateless, logout is handled client-side
    by discarding the token. This endpoint exists for API completeness.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return current_user
