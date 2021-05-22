const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.getAllOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let fields;
        if (req.query.fields) fields = req.query.fields.split(',').join(' ');
        const query = await Model.find(JSON.parse(queryStr))
            .sort(req.query.sort)
            .select(fields)
            .limit(req.limit)
            .skip(req.skip)
            .cache({ id: req.user._id });

        const doc = await query;

        res.status(200).json({
            status: 'success',
            result: doc.length,
            data: {
                doc,
            },
        });
    });

exports.getOne = (Model, populate) =>
    catchAsync(async (req, res, next) => {
        let doc;
        if (populate)
            doc = await Model.findById(req.params.id)
                .populate(populate)
                .cache({ id: req.user._id });
        else doc = await Model.findById(req.params.id).cache({ id: req.user._id });
        if (!doc) {
            return next(new AppError('doc whit id is not fond. please enter correct id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const updateDuc = await Model.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({
            status: 'success',
            data: {
                updateDuc,
            },
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const deleteDuc = await Model.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: {
                deleteDuc,
            },
        });
    });
