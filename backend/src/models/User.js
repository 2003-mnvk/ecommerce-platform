import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,"Name is required"],
        trim:true,
        minlength:[2,"Name must contain atleast 2 characters"],
        maxLength:[50,"Name cannot exceed 50 characters"]
    },
    email:{
        type:String,
        require: [true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        require:[true,"Password is required"],
        minlength:[8,"Password must contain atleast 8 characters"],
        select:false
    },
    role:{
        type:String,
        enum:["customer","seller","admin"],
        default:"customer"
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    refreshToken:{
        type:String,
        select:false
    }
},
{
    timestamps:true,
}
);

userSchema.pre("save",async function (){
    if(!this.isModified("password")){
        return;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);

});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password,this.password);
}

const User = mongoose.model("User",userSchema);

export default User;