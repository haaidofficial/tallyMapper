const mongoose = require("mongoose");

// Define the schema for an enterprise
const enterpriseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        contact: {
            type: String,
        },
        apiConfigurations: [
            {
                apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiEndpoints' },
                apiName: { type: String },
                headers: { type: mongoose.Schema.Types.Mixed, default: null },
                apiKey: { type: String, default: null }
            }
        ],
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create the Enterprise model based on the schema
const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

module.exports = Enterprise;
