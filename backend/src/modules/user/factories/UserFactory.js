export default {
    create: (row) => {
        let userContainer = {};

        userContainer.id = row.id;
        userContainer.createTime = row.create_time;
        userContainer.name = row.name;
        userContainer.url = row.url;
        userContainer.theme = row.theme;
        userContainer.company = {
            name: row.company_name,
            url: row.company_url,
        };

        return userContainer;
    },
};
