import AuditLog from '../models/AuditLog.js';

class AuditLogService {
  static async logBookingAction(req, action, resourceId, metadata, status = 'SUCCESS', errorMessage = null) {
    try {
      const auditLog = new AuditLog({
        userId: req.user?.id || req.user?._id,
        action,
        resourceType: 'BOOKING',
        resourceId,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status,
        errorMessage,
        metadata: {
          sessionType: metadata?.sessionType,
          mentorId: metadata?.mentorId,
          amount: metadata?.amount,
        },
        changes: {
          before: metadata?.before,
          after: metadata?.after,
        },
      });

      await auditLog.save();
      console.log(`✅ Audit Log: ${action} by user ${req.user?.id}`);
    } catch (err) {
      console.error('Error logging audit:', err);
    }
  }

  static async logAuthAction(req, action, status = 'SUCCESS', errorMessage = null) {
    try {
      const auditLog = new AuditLog({
        userId: req.user?.id || req.user?._id,
        action,
        resourceType: 'USER',
        resourceId: req.user?.id || req.user?._id,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status,
        errorMessage,
      });

      await auditLog.save();
      console.log(`✅ Audit Log: ${action} by user ${req.user?.id}`);
    } catch (err) {
      console.error('Error logging auth audit:', err);
    }
  }
}

export default AuditLogService;
