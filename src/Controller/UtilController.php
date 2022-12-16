<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UtilController extends AbstractController
{
    #[Route('/dpt-url', name: 'dpt_url', methods: ['GET'])]
    public function dptUrl()
    {
        return new JsonResponse([
            'dptUrl' => $this->getParameter('dptUrl')
        ]);
    }

    #[Route('/dpt-mq-url', name: 'dpt_mq_url', methods: ['GET'])]
    public function dptMqUrl()
    {
        return new JsonResponse([
            'dptMqUrl' => $this->getParameter('dptMqUrl')
        ]);
    }

}