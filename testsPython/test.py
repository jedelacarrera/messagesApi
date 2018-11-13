"""Test messages api."""
from pytest import mark, fixture
import requests
import random


BASE_URL = 'http://localhost:3000/api'


@fixture(name='service_user')
def _service_user():
    json_data = requests.post(
        BASE_URL + '/people/login',
        data={'email': 'a@a.cl', 'password': '1234'}
    ).json()

    return {
        "id": json_data['userId'],
        "access_token": json_data['id'],
        "email": 'a@a.cl',
        "password": '1234',
    }

@fixture(name='user_user')
def _user_user():
    json_data = requests.post(
        BASE_URL + '/people/login',
        data={'email': 'b@b.cl', 'password': '1234'}
    ).json()

    return {
        "id": json_data['userId'],
        "access_token": json_data['id'],
        "email": 'b@b.cl',
        "password": '1234',
    }

@fixture(name='admin_user')
def _admin_user():
    json_data = requests.post(
        BASE_URL + '/people/login',
        data={'email': 'admin@admin.cl', 'password': '1234'}
    ).json()

    return {
        "id": json_data['userId'],
        "access_token": json_data['id'],
        "email": 'admin@admin.cl',
        "password": '1234',
    }


@mark.parametrize(
    'email, password, expected', [
        ('a@a.cl', '1234', 200),
        ('b@b.cl', '1234', 200),
        ('b@b.cl', 'wrong', 401),
        ('wrong@b.cl', '1234', 401),
    ]
)
def test_login(email, password, expected):
    """Test login."""
    result = requests.post(
        BASE_URL + '/people/login',
        data={'email': email, 'password': password}
    )

    assert result.status_code == expected


@mark.parametrize(
    'email, password, expected', [
        ('a@a.cl', '1234', 'SERVICE'),
        ('b@b.cl', '1234', 'USER'),
    ]
)
def test_user_info(email, password, expected):
    """Test login."""
    user_data = get_user_info(email, password)

    assert user_data['account_type'] == expected


@mark.parametrize(
    'email, password, expected_code, expected_type', [
        ('a@a.cl', '1234', 200, list),
        ('b@b.cl', '1234', 200, list),
    ]
)
def test_get_posts(email, password, expected_code, expected_type):
    """Test Get posts through service"""
    user_data = get_user_info(email, password)
    posts = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    assert posts.status_code == expected_code
    assert type(posts.json()) == expected_type

def get_user_info(email, password):
    result = requests.post(
        BASE_URL + '/people/login',
        data={'email': email, 'password': password}
    )
    json_data = result.json()
    user = requests.get(
        f"{BASE_URL}/people/{json_data['userId']}",
        params={'access_token': json_data['id']}
    )

    return {
        "id": json_data['userId'],
        "access_token": json_data['id'],
        "service_id": user.json()['serviceId'],
        "account_type": user.json()['accountType']
    }

def test_filter_posts(user_user):
    """Test Get posts through service"""
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/filterPosts/filterString",
        params={'access_token': user_data['access_token']},
    )

    intitial_length = len(data.json())

    requests.post(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']},
        data={'title': 'test filter filterString', 'description': 'null description'}
    )

    requests.post(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']},
        data={'title': 'null title', 'description': 'test filter filterString'}
    )

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/filterPosts/filterString",
        params={'access_token': user_data['access_token']},
    ) 

    assert intitial_length + 2 == len(data.json())

def test_filter_messages(user_user):
    """Test Get posts through service"""
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/filterMessages/filterStringMessage",
        params={'access_token': user_data['access_token']},
    )

    intitial_length = len(data.json())

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']},
    )

    requests.post(
        f"{BASE_URL}/posts/{data.json()[0]['id']}/messages",
        params={'access_token': user_data['access_token']},
        data={'description': 'test filter filterStringMessage'}
    )

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/filterMessages/filterStringMessage",
        params={'access_token': user_data['access_token']},
    )  

    assert intitial_length + 1 == len(data.json())
    

@mark.parametrize(
    'url, expected', [
        ("services/", 401),
        ("services/1", 401),
        ("posts", 401),
        ("posts/1", 401),
        ("messages", 401),
        ("messages/1", 401),
        ("responses/1", 404),
    ]
)
def test_unauthorized(url, expected):
    data = requests.get(
        f"{BASE_URL}/{url}",
    )

    assert data.status_code == expected

@mark.parametrize(
    'url, expected', [
        ("services/", 401),
        ("services/1", 401),
        ("posts", 401),
        ("posts/1", 401),
        ("messages", 401),
        ("messages/1", 401),
        ("responses/1", 404),
    ]
)
def test_unauthorized2(user_user, url, expected):
    data = requests.get(
        f"{BASE_URL}/{url}",
        params={'access_token': user_user['access_token']},
    )
    try :
        assert data.status_code == expected
    except:
        print(url)
        assert data.status_code == expected

def test_authorized(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",  # services/id/posts
        params={'access_token': user_data['access_token']}
    )

    assert data.status_code == 200

    posts = data.json()

    data = requests.get(
        f"{BASE_URL}/posts/{posts[0]['id']}",  # posts
        params={'access_token': user_data['access_token']}
    )

    assert data.status_code == 200

    data = requests.get(
        f"{BASE_URL}/posts/{posts[0]['id']}/messages",  # posts/id/messages
        params={'access_token': user_data['access_token']}
    )

    assert data.status_code == 200
    assert len(data.json()) > 0

    messages = data.json()

    data = requests.get(
        f"{BASE_URL}/messages/{messages[0]['id']}/responses",  # messages/id/responses
        params={'access_token': user_data['access_token']}
    )

    assert data.status_code == 200
    assert len(data.json()) > 0

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",  # services/id/subscriptions
        params={'access_token': user_data['access_token']}
    )

    assert data.status_code == 200
    assert len(data.json()) > 0



def test_create_post(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    length = len(data.json())

    data = requests.post(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']},
        data={'title': 'post test function title', 'description': 'post test function description'}
    )


    assert data.status_code == 200
    assert data.json()['serviceId'] == user_data['service_id']
    assert data.json()['personId'] == user_data['id']

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    assert length + 1 == len(data.json())

def test_create_message(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    post_id = data.json()[0]['id']

    data = requests.get(
        f"{BASE_URL}/posts/{post_id}/messages",
        params={'access_token': user_data['access_token']}
    )

    length = len(data.json())

    data = requests.post(
        f"{BASE_URL}/posts/{post_id}/messages",
        params={'access_token': user_data['access_token']},
        data={'description': 'message test function description'}
    )

    assert data.status_code == 200
    assert data.json()['personId'] == user_data['id']
    assert data.json()['postId'] == post_id

    data = requests.get(
        f"{BASE_URL}/posts/{post_id}/messages",
        params={'access_token': user_data['access_token']}
    )

    assert length + 1 == len(data.json())

def test_create_response(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])
    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    post_id = data.json()[0]['id']

    data = requests.get(
        f"{BASE_URL}/posts/{post_id}/messages",
        params={'access_token': user_data['access_token']}
    )

    message_id = data.json()[0]['id']

    data = requests.get(
        f"{BASE_URL}/messages/{message_id}/responses",
        params={'access_token': user_data['access_token']},
    )

    length = len(data.json())

    data = requests.post(
        f"{BASE_URL}/messages/{message_id}/responses",
        params={'access_token': user_data['access_token']},
        data={'description': 'response test function description'}
    )

    assert data.status_code == 200
    assert data.json()['personId'] == user_data['id']
    assert data.json()['messageId'] == message_id

    data = requests.get(
        f"{BASE_URL}/messages/{message_id}/responses",
        params={'access_token': user_data['access_token']}
    )

    assert length + 1 == len(data.json())

def test_create_user(service_user):
    user_data = get_user_info(service_user['email'], service_user['password'])
    random_number = random.randint(1000, 9999)
    data = requests.post(
        f"{BASE_URL}/services/{user_data['service_id']}/people",
        params={'access_token': user_data['access_token']},
        data={'email': f'test{random_number}@test.cl', 'password': '1234'}
    )

    assert data.status_code == 200
    assert data.json()['email'] == f'test{random_number}@test.cl'

def test_create_user_not_allowed(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])
    random_number = random.randint(1000, 9999)
    data = requests.post(
        f"{BASE_URL}/services/{user_data['service_id']}/people",
        params={'access_token': user_data['access_token']},
        data={'email': f'test{random_number}@test.cl', 'password': '1234'}
    )

    assert data.status_code == 401

def test_get_subscriptions(user_user):
    data = requests.get(
        f"{BASE_URL}/people/{user_user['id']}/subscriptions",
        params={'access_token': user_user['access_token']},
        )

    assert data.status_code == 200
    assert len(data.json()) > 0

def test_create_and_delete_subscriptions(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    post_id = data.json()[0]['id']

    data = requests.get(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        )

    intitial_length = len(data.json())

    subscription_data = requests.post(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        data={'postId': post_id}
        )

    data = requests.get(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        )

    assert intitial_length + 1 == len(data.json())
    assert subscription_data.status_code == 200
    assert subscription_data.json()['personId'] == user_data['id']
    assert subscription_data.json()['postId'] == post_id

    data = requests.delete(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions/{subscription_data.json()['id']}",
        params={'access_token': user_data['access_token']},
        )

    assert data.status_code == 204

    data = requests.get(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        )

    assert intitial_length == len(data.json())

    data = requests.post(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        data={'postId': 1}
        )

    assert data.status_code in [400, 401]

def test_create_service(admin_user, service_user):
    service_data = requests.post(
        f"{BASE_URL}/services/",
        params={'access_token': admin_user['access_token']},
        data={'name': 'test service'}
    )

    assert service_data.status_code == 200
    assert service_data.json()['name'] == 'test service'

    random_number = random.randint(1000, 9999)
    data = requests.post(
        f"{BASE_URL}/services/{service_data.json()['id']}/people",
        params={'access_token': admin_user['access_token']},
        data={'email': f'test{random_number}@test.cl', 'password': '1234'}
    )

    assert data.status_code == 200
    assert data.json()['email'] ==  f'test{random_number}@test.cl'
    assert data.json()['serviceId'] ==  service_data.json()['id']
    assert data.json()['accountType'] == 'SERVICE'


    data = requests.post(
        f"{BASE_URL}/services/",
        params={'access_token': service_user['access_token']},
        data={'name': 'test service2'}
    )

    assert data.status_code == 401

    data = requests.post(
        f"{BASE_URL}/services/{service_data.json()['id']}/people",
        params={'access_token': service_user['access_token']},
        data={'email': f'test{random_number}@test.cl', 'password': '1234'}
    )

    assert data.status_code == 401


def test_reset_notifications(user_user):
    user_data = get_user_info(user_user['email'], user_user['password'])

    data = requests.get(
        f"{BASE_URL}/services/{user_data['service_id']}/posts",
        params={'access_token': user_data['access_token']}
    )

    post_id = data.json()[0]['id']

    subscription_data = requests.post(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        data={'postId': post_id, 'notification': True}
        )

    data = requests.get(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        )

    print(data.json())
    intitial_length = len(data.json())

    assert 0 < intitial_length
    assert data.json()[-1]['postId'] == post_id
    assert data.json()[-1]['notification'] == True

    subscription_data = requests.post(
        f"{BASE_URL}/people/{user_data['id']}/resetNotifications",
        params={'access_token': user_data['access_token']}
        )

    assert subscription_data.status_code == 204

    data = requests.get(
        f"{BASE_URL}/people/{user_data['id']}/subscriptions",
        params={'access_token': user_data['access_token']},
        )

    print(data.json())

    assert intitial_length == len(data.json())
    assert data.json()[-1]['postId'] == post_id
    assert data.json()[-1]['notification'] == False
