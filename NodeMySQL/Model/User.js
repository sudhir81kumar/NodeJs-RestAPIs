//Define constructor for user class

const User = function (user) {
    this.FirstName = user.FirstName;
    this.LastName = user.LastName;
    this.Email = user.Email;
    this.Age = user.Age;
    this.Department = user.Department;
    this.CreatedDate = user.CreatedDate;
    this.IsActive = user.IsActive;
};

module.exports = {
    User
}