export default {
    create: (row) => {
        let projectContainer = {};

        projectContainer.id = row.id;
        projectContainer.createTime = row.create_time;
        projectContainer.name = row.name;
        projectContainer.url = row.url;

        return projectContainer;
    },
};
