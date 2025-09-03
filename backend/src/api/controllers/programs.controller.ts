import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/startup/database';
import { logger } from '../../infrastructure/logging/logger';
import { AuthenticatedRequest } from '../middleware/auth';

// Get all programs with filtering
export async function getPrograms(req: Request, res: Response) {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { status, assignedOfficerId, domainId, complexity } = req.query;

    // Build where clause based on user role and filters
    let whereClause: any = {};

    // Role-based filtering
    if (user?.roleCode === 4) { // גורם דורש
      whereClause.requesterId = user.id;
    } else if (user?.roleCode === 3) { // קניין
      whereClause.assignedOfficerId = user.id;
    } else if (user?.roleCode === 2) { // ראש צוות
      // Filter by team - would need to implement team logic
    }

    // Apply additional filters
    if (status) {
      whereClause.status = status;
    }
    if (assignedOfficerId) {
      whereClause.assignedOfficerId = parseInt(assignedOfficerId as string);
    }
    if (domainId) {
      whereClause.domainId = parseInt(domainId as string);
    }
    if (complexity) {
      whereClause.complexity = parseInt(complexity as string);
    }

    const programs = await prisma.program.findMany({
      where: whereClause,
      include: {
        requester: true,
        division: true,
        department: true,
        domain: true,
        assignedOfficer: true,
        stations: {
          include: {
            activity: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data for frontend
    const transformedPrograms = programs.map(program => ({
      taskId: program.id,
      workYear: program.workYear,
      requiredQuarter: program.requiredQuarter,
      title: program.title,
      description: program.description,
      status: program.status,
      requesterId: program.requesterId,
      requesterName: program.requester?.fullName,
      divisionId: program.divisionId,
      divisionName: program.division?.name,
      departmentId: program.departmentId,
      departmentName: program.department?.name,
      domainId: program.domainId,
      domainName: program.domain?.description,
      complexity: program.complexity,
      assignedOfficerId: program.assignedOfficerId,
      assignedOfficerName: program.assignedOfficer?.fullName,
      teamName: program.assignedOfficer?.procurementTeam,
      estimatedAmount: program.estimatedAmount,
      currency: program.currency,
      planningSource: program.planningSource,
      startDate: program.startDate,
      lastUpdate: program.updatedAt,
      createdAt: program.createdAt,
      stations: program.stations
    }));

    res.json({
      success: true,
      data: transformedPrograms
    });

  } catch (error) {
    logger.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Get single program
export async function getProgram(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const programId = parseInt(id);

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        requester: true,
        division: true,
        department: true,
        domain: true,
        assignedOfficer: true,
        stations: {
          include: {
            activity: true
          }
        }
      }
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found'
      });
    }

    // Transform data for frontend
    const transformedProgram = {
      taskId: program.id,
      workYear: program.workYear,
      requiredQuarter: program.requiredQuarter,
      title: program.title,
      description: program.description,
      status: program.status,
      requesterId: program.requesterId,
      requesterName: program.requester?.fullName,
      divisionId: program.divisionId,
      divisionName: program.division?.name,
      departmentId: program.departmentId,
      departmentName: program.department?.name,
      domainId: program.domainId,
      domainName: program.domain?.description,
      complexity: program.complexity,
      assignedOfficerId: program.assignedOfficerId,
      assignedOfficerName: program.assignedOfficer?.fullName,
      teamName: program.assignedOfficer?.procurementTeam,
      estimatedAmount: program.estimatedAmount,
      currency: program.currency,
      planningSource: program.planningSource,
      startDate: program.startDate,
      planningNotes: program.planningNotes,
      officerNotes: program.officerNotes,
      lastUpdate: program.updatedAt,
      createdAt: program.createdAt,
      stations: program.stations
    };

    res.json({
      success: true,
      data: transformedProgram
    });

  } catch (error) {
    logger.error('Get program error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Create new program
export async function createProgram(req: Request, res: Response) {
  try {
    const user = (req as AuthenticatedRequest).user;
    const {
      workYear,
      requiredQuarter,
      title,
      description,
      requesterId,
      divisionId,
      departmentId,
      domainId,
      estimatedAmount,
      currency,
      supplierList,
      justification,
      planningSource,
      complexity,
      startDate
    } = req.body;

    // Validate required fields
    if (!workYear || !requiredQuarter || !title || !requesterId || !divisionId || !planningSource) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const program = await prisma.program.create({
      data: {
        workYear,
        requiredQuarter: new Date(requiredQuarter),
        title,
        description,
        requesterId,
        divisionId,
        departmentId,
        domainId,
        estimatedAmount,
        currency,
        supplierList,
        justification,
        planningSource,
        complexity,
        startDate: startDate ? new Date(startDate) : null,
        status: 'Open'
      },
      include: {
        requester: true,
        division: true,
        department: true,
        domain: true
      }
    });

    logger.info(`Program created: ${program.id} by user: ${user?.employeeId}`);

    res.status(201).json({
      success: true,
      data: {
        taskId: program.id,
        title: program.title,
        status: program.status
      }
    });

  } catch (error) {
    logger.error('Create program error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Update program
export async function updateProgram(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const programId = parseInt(id);
    const updateData = req.body;

    // Convert date strings to Date objects
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.requiredQuarter) {
      updateData.requiredQuarter = new Date(updateData.requiredQuarter);
    }

    const program = await prisma.program.update({
      where: { id: programId },
      data: updateData,
      include: {
        requester: true,
        division: true,
        department: true,
        domain: true,
        assignedOfficer: true
      }
    });

    res.json({
      success: true,
      data: program
    });

  } catch (error) {
    logger.error('Update program error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}