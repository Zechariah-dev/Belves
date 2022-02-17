const moment = require('moment');

class BaseRepository {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload = {}) {
    return this.Model.create(payload);
  }

  findOne(condition = {}) {
    return this.Model.findOne({ ...condition });
  }

  findById(id) {
    return this.Model.findById(id)
      .catch(() => null);
  }

  all(condition = {}) {
    return this.Model.find(condition);
  }

  createMany(data = []) {
    return this.Model.insertMany(data);
  }

  deleteMany(condition = {}) {
    return this.Model.deleteMany(condition);
  }

  deleteOne(condition = {}) {
    return this.Model.deleteOne(condition);
  }

  updateOne(condition = {}, data = {}) {
    return this.Model.findOneAndUpdate(condition, data, { new: true });
  }

  count(condition = {}) {
    return this.Model.find(condition).count();
  }

  filter(queries) {
    const {
      page, limit, sort, ...rest
    } = queries;
    let { dateFrom, dateTo } = queries;
    const query = { ...rest };

    if (dateTo && dateFrom) {
      dateFrom = moment(new Date(dateFrom));
      dateTo = moment(new Date(dateTo));
      query.createdAt = {
        $gte: dateFrom.utc().startOf('day').toISOString(),
        $lte: dateTo.utc().endOf('day').toISOString(),
      };
    }
    return this.all(
      query,
      page,
      limit,
    ).sort(sort);
  }
}

module.exports = BaseRepository;
