from django.http import JsonResponse

USERS = ["Alice", "Bob", "Charlie", "David", "Eve"]

def users(request):
    try:
        return JsonResponse({"users": len(USERS)}, status=200)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
