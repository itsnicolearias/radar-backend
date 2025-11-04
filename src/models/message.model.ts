import { DataTypes, Model } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"
import type {
  MessageAttributes as ImportedMessageAttributes,
  MessageCreationAttributes as ImportedMessageCreationAttributes,
} from "../interfaces/message.interface"
import { decryptMessage, decryptText } from "../utils/crypto";

class Message
  extends Model<ImportedMessageAttributes, ImportedMessageCreationAttributes>
  implements ImportedMessageAttributes
{
  public messageId!: string;
  public senderId!: string;
  public receiverId!: string;
  public content!: string;
  public iv!: string | null;
  public authTag!: string | null;
  public isRead!: boolean;
  public readonly createdAt!: Date;
}

Message.init(
  {
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "message_id",
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      field: "sender_id",
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      field: "receiver_id",
    },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        // El contenido se guarda como el ciphertext (hex) cuando se usa
        // encryptMessage en el servicio. Al leer devolvemos el texto
        // desencriptado en función de los campos iv / authTag cuando estén
        // presentes. Si no hay iv/authTag, intentamos el fallback decryptText
        get() {
          const rawValue = this.getDataValue("content")
          if (!rawValue) return null

          const iv = this.getDataValue("iv")
          const authTag = this.getDataValue("authTag")

          try {
            if (iv && authTag) {
              return decryptMessage(rawValue, iv, authTag)
            }

            // Fallback para mensajes antiguos que usaban encryptText (iv:encrypted)
            try {
              return decryptText(rawValue)
            } catch {
              // Si no se puede desencriptar con decryptText, devolvemos el valor crudo
              return rawValue
            }
          } catch {
            // Si falla la desencriptación GCM, devolvemos crudo para evitar romper
            return rawValue
          }
        },
      },
    iv: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authTag: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'auth_tag',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_read",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: false,
  }
)

// Define associations
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
})

User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "receivedMessages",
})

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
})

Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
})

export default Message
