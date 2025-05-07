import { fetchData } from "./fetchData";

async function test_fetch() {
    const data = await fetchData("specialists/list?page=0&limit=10")
    return data;
}

async function test_login() {
    const tokens_data = await fetchData(
        "auth/login",
        {method: 'POST', body: JSON.stringify({
            email: "my@ksalnikov.ru",
            password: "qwerty123"
        })
        }
    )
    return tokens_data;
}

export default async function get_profile() {
    const tokens = await test_login();
    const profile_data = await fetchData('profile/user', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });
    return profile_data;
}